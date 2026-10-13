import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata, cleanObject } from '../utils/helpers.js';
import { statistiquesUtilisateur, CHAMPS_PUBLICS } from './authController.js';
import ApiError from '../utils/ApiError.js';

const ROLES_VALIDES = ['etudiant', 'contributeur', 'admin'];
const STATUTS_VALIDES = ['actif', 'inactif', 'suspendu'];

// ============================================
// STATISTIQUES DE L'UTILISATEUR CONNECTÉ
// @route GET /api/v1/users/me/stats
// @access Private
// ============================================
export const getMyStats = asyncHandler(async (req, res) => {
  const stats = await statistiquesUtilisateur(req.user.id);

  if (!stats) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  const badges = await query(
    `SELECT b.id, b.nom, b.slug, b.description, b.icon, ub.obtained_at
     FROM user_badges ub
     JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = ?
     ORDER BY ub.obtained_at DESC`,
    [req.user.id]
  );

  // Répartition des contributions par statut (onglet « Aperçu » du profil)
  const contributions = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'validee') AS validees,
       SUM(status = 'en_attente') AS en_attente,
       SUM(status = 'refusee') AS refusees,
       COALESCE(SUM(download_count), 0) AS telechargements_recus
     FROM resources
     WHERE user_id = ? AND is_active = TRUE`,
    [req.user.id]
  );

  const rows = contributions[0] || {};

  return apiResponse(res, 200, true, 'Statistiques récupérées', {
    stats: {
      ...stats,
      contributions_detail: {
        total: Number(rows.total) || 0,
        validees: Number(rows.validees) || 0,
        en_attente: Number(rows.en_attente) || 0,
        refusees: Number(rows.refusees) || 0,
        telechargements_recus: Number(rows.telechargements_recus) || 0
      }
    },
    badges
  });
});

// ============================================
// ACTIVITÉ RÉCENTE
// @route GET /api/v1/users/me/activities
// @access Private
// ============================================
export const getMyActivities = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const conditions = ['a.user_id = ?'];
  const params = [req.user.id];

  if (req.query.type) {
    conditions.push('a.type = ?');
    params.push(req.query.type);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const activites = await query(
    `SELECT
       a.id, a.type, a.titre, a.points, a.created_at,
       c.nom AS matiere,
       r.id AS resource_id, r.type AS resource_type
     FROM activities a
     LEFT JOIN categories c ON c.id = a.category_id
     LEFT JOIN resources r ON r.id = a.resource_id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM activities a ${where}`, params);

  const pointsRows = await query(
    `SELECT COALESCE(SUM(points), 0) AS points_periode
     FROM activities
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [req.user.id]
  );

  return apiResponse(res, 200, true, 'Activités récupérées', {
    activities: activites,
    points_30_jours: Number(pointsRows[0]?.points_periode) || 0,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// PRÉFÉRENCES
// @route PATCH /api/v1/users/me/preferences
// @access Private
// ============================================
export const updateMyPreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  if (typeof preferences !== 'object' || preferences === null || Array.isArray(preferences)) {
    throw ApiError.badRequest('Le champ « preferences » doit être un objet');
  }

  const autorisees = ['notifications_email', 'profil_public', 'participer_classement'];
  const nettoyees = Object.fromEntries(
    Object.entries(preferences).filter(([cle]) => autorisees.includes(cle))
  );

  if (Object.keys(nettoyees).length === 0) {
    throw ApiError.badRequest(`Clés acceptées : ${autorisees.join(', ')}`);
  }

  const rows = await query('SELECT preferences FROM users WHERE id = ?', [req.user.id]);
  const existantes = rows[0]?.preferences || {};
  const fusion = { ...existantes, ...nettoyees };

  await query('UPDATE users SET preferences = ? WHERE id = ?', [JSON.stringify(fusion), req.user.id]);

  return apiResponse(res, 200, true, 'Préférences mises à jour', { preferences: fusion });
});

// ============================================
// ADMINISTRATION : LISTE DES UTILISATEURS
// @route GET /api/v1/admin/users
// @access Private/Admin
// ============================================
export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const conditions = [];
  const params = [];

  if (req.query.role && req.query.role !== 'tous') {
    if (!ROLES_VALIDES.includes(req.query.role)) {
      throw ApiError.badRequest(`Rôle invalide. Valeurs acceptées : ${ROLES_VALIDES.join(', ')}`);
    }
    conditions.push('u.role = ?');
    params.push(req.query.role);
  }

  if (req.query.status && req.query.status !== 'tous') {
    if (!STATUTS_VALIDES.includes(req.query.status)) {
      throw ApiError.badRequest(`Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}`);
    }
    conditions.push('u.status = ?');
    params.push(req.query.status);
  }

  if (req.query.search) {
    conditions.push('(u.nom LIKE ? OR u.prenom LIKE ? OR u.email LIKE ?)');
    const motif = `%${req.query.search}%`;
    params.push(motif, motif, motif);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const utilisateurs = await query(
    `SELECT
       u.id, u.nom, u.prenom, u.email, u.telephone, u.niveau, u.filiere, u.specialite,
       u.institution, u.role, u.status, u.points, u.is_verified, u.created_at, u.last_login,
       (SELECT COUNT(*) FROM resources r WHERE r.user_id = u.id AND r.is_active = TRUE) AS contributions,
       (SELECT COUNT(*) FROM downloads d WHERE d.user_id = u.id) AS telechargements,
       (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS quiz_completes
     FROM users u
     ${where}
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM users u ${where}`, params);

  const statsRows = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'actif') AS actifs,
       SUM(status = 'inactif') AS inactifs,
       SUM(status = 'suspendu') AS suspendus,
       SUM(role = 'etudiant') AS etudiants,
       SUM(role = 'contributeur') AS contributeurs,
       SUM(role = 'admin') AS admins,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS nouveaux_30j
     FROM users`
  );

  const stats = statsRows[0] || {};

  return apiResponse(res, 200, true, 'Utilisateurs récupérés', {
    users: utilisateurs,
    stats: {
      total: Number(stats.total) || 0,
      actifs: Number(stats.actifs) || 0,
      inactifs: Number(stats.inactifs) || 0,
      suspendus: Number(stats.suspendus) || 0,
      etudiants: Number(stats.etudiants) || 0,
      contributeurs: Number(stats.contributeurs) || 0,
      admins: Number(stats.admins) || 0,
      nouveaux_30j: Number(stats.nouveaux_30j) || 0
    },
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// ADMINISTRATION : DÉTAIL D'UN UTILISATEUR
// @route GET /api/v1/admin/users/:id
// @access Private/Admin
// ============================================
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rows = await query(`SELECT ${CHAMPS_PUBLICS} FROM users WHERE id = ?`, [id]);

  if (rows.length === 0) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  const ressources = await query(
    `SELECT r.id, r.titre, r.type, r.status, r.download_count, r.created_at, c.nom AS matiere
     FROM resources r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.user_id = ? AND r.is_active = TRUE
     ORDER BY r.created_at DESC
     LIMIT 10`,
    [id]
  );

  const activites = await query(
    `SELECT id, type, titre, points, created_at
     FROM activities
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 10`,
    [id]
  );

  const badges = await query(
    `SELECT b.id, b.nom, b.icon, ub.obtained_at
     FROM user_badges ub
     JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = ?
     ORDER BY ub.obtained_at DESC`,
    [id]
  );

  return apiResponse(res, 200, true, 'Utilisateur récupéré', {
    user: rows[0],
    stats: await statistiquesUtilisateur(id),
    resources: ressources,
    activities: activites,
    badges
  });
});

// ============================================
// ADMINISTRATION : MODIFIER UN UTILISATEUR
// @route PATCH /api/v1/admin/users/:id
// @access Private/Admin
// ============================================
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, status, points, is_verified } = req.body;

  const rows = await query('SELECT id, role FROM users WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  if (Number(id) === req.user.id && (role !== undefined || status !== undefined)) {
    throw ApiError.badRequest('Vous ne pouvez pas modifier votre propre rôle ou statut');
  }

  if (role !== undefined && !ROLES_VALIDES.includes(role)) {
    throw ApiError.badRequest(`Rôle invalide. Valeurs acceptées : ${ROLES_VALIDES.join(', ')}`);
  }

  if (status !== undefined && !STATUTS_VALIDES.includes(status)) {
    throw ApiError.badRequest(`Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}`);
  }

  const champs = cleanObject({ role, status, is_verified });

  if (points !== undefined) {
    const pointsNum = parseInt(points, 10);
    if (!Number.isInteger(pointsNum) || pointsNum < 0) {
      throw ApiError.badRequest('Le nombre de points doit être un entier positif');
    }
    champs.points = pointsNum;
  }

  if (Object.keys(champs).length === 0) {
    throw ApiError.badRequest('Aucun champ à mettre à jour');
  }

  const set = Object.keys(champs).map((champ) => `${champ} = ?`).join(', ');
  await query(`UPDATE users SET ${set} WHERE id = ?`, [...Object.values(champs), id]);

  const utilisateurs = await query(`SELECT ${CHAMPS_PUBLICS} FROM users WHERE id = ?`, [id]);

  return apiResponse(res, 200, true, 'Utilisateur mis à jour', { user: utilisateurs[0] });
});

// ============================================
// ADMINISTRATION : SUPPRIMER UN UTILISATEUR
// @route DELETE /api/v1/admin/users/:id
// @access Private/Admin
// ============================================
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    throw ApiError.badRequest('Vous ne pouvez pas supprimer votre propre compte');
  }

  const rows = await query("SELECT id FROM users WHERE id = ? AND role <> 'admin'", [id]);

  if (rows.length === 0) {
    throw ApiError.forbidden('Compte introuvable ou protégé (les administrateurs ne peuvent pas être supprimés)');
  }

  // Désactivation plutôt que suppression physique : les ressources et
  // l'historique (téléchargements, quiz, favoris) restent cohérents.
  await query("UPDATE users SET status = 'inactif' WHERE id = ?", [id]);

  return apiResponse(res, 200, true, 'Compte désactivé');
});

export default {
  getMyStats,
  getMyActivities,
  updateMyPreferences,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};
