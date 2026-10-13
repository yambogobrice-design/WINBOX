import { query } from '../config/database.js';
import { apiResponse, asyncHandler, periodeEnJours, paginate, paginationMetadata } from '../utils/helpers.js';

// Variation en pourcentage entre deux valeurs
const evolution = (actuel, precedent) => {
  const a = Number(actuel) || 0;
  const p = Number(precedent) || 0;

  if (p === 0) return a > 0 ? '+100%' : '0%';

  const variation = Math.round(((a - p) / p) * 100);
  return `${variation >= 0 ? '+' : ''}${variation}%`;
};

// ============================================
// TABLEAU DE BORD
// @route GET /api/v1/admin/stats?periode=7j|30j|90j
// @access Private/Admin
// ============================================
export const getDashboardStats = asyncHandler(async (req, res) => {
  const jours = periodeEnJours(req.query.periode, 30);

  const utilisateurs = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'actif') AS actifs,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode_precedente,
       SUM(last_login >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS connectes_periode
     FROM users`,
    [jours, jours * 2, jours, jours]
  );

  const ressources = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'validee') AS validees,
       SUM(status = 'en_attente') AS en_attente,
       SUM(status = 'refusee') AS refusees,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode_precedente
     FROM resources
     WHERE is_active = TRUE`,
    [jours, jours * 2, jours]
  );

  const telechargements = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(created_at >= CURDATE()) AS aujourdhui,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode_precedente
     FROM downloads`,
    [jours, jours * 2, jours]
  );

  const contributions = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'en_attente') AS en_attente,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode,
       SUM(created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)) AS periode_precedente
     FROM resources
     WHERE is_active = TRUE`,
    [jours, jours * 2, jours]
  );

  const populaires = await query(
    `SELECT r.id, r.titre, r.type, r.download_count AS downloads, r.rating_avg AS note, c.nom AS matiere
     FROM resources r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.status = 'validee' AND r.is_active = TRUE
     ORDER BY r.download_count DESC
     LIMIT 5`
  );

  const enAttente = await query(
    `SELECT r.id, r.titre, r.type, r.created_at, c.nom AS matiere,
            CONCAT(u.prenom, ' ', u.nom) AS auteur, u.email AS auteur_email
     FROM resources r
     LEFT JOIN categories c ON c.id = r.category_id
     JOIN users u ON u.id = r.user_id
     WHERE r.status = 'en_attente' AND r.is_active = TRUE
     ORDER BY r.created_at ASC
     LIMIT 10`
  );

  const u = utilisateurs[0] || {};
  const r = ressources[0] || {};
  const t = telechargements[0] || {};
  const c = contributions[0] || {};

  return apiResponse(res, 200, true, 'Statistiques du tableau de bord', {
    periode: `${jours}j`,
    stats: {
      utilisateurs: {
        total: Number(u.total) || 0,
        nouveaux: Number(u.periode) || 0,
        actifs: Number(u.actifs) || 0,
        connectes_periode: Number(u.connectes_periode) || 0,
        evolution: evolution(u.periode, u.periode_precedente)
      },
      ressources: {
        total: Number(r.total) || 0,
        validees: Number(r.validees) || 0,
        enAttente: Number(r.en_attente) || 0,
        refusees: Number(r.refusees) || 0,
        evolution: evolution(r.periode, r.periode_precedente)
      },
      telechargements: {
        total: Number(t.total) || 0,
        aujourdhui: Number(t.aujourdhui) || 0,
        evolution: evolution(t.periode, t.periode_precedente)
      },
      contributions: {
        total: Number(c.total) || 0,
        enAttente: Number(c.en_attente) || 0,
        evolution: evolution(c.periode, c.periode_precedente)
      }
    },
    ressourcesPopulaires: populaires,
    actionsEnAttente: enAttente
  });
});

// ============================================
// JOURNAL D'ACTIVITÉ DE LA PLATEFORME
// @route GET /api/v1/admin/activity
// @access Private/Admin
// ============================================
export const getRecentActivity = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 30);

  const activites = await query(
    `SELECT * FROM (
       SELECT
         CONCAT('ressource-', r.id) AS id,
         'nouvelle_ressource' AS type,
         CONCAT(u.prenom, ' ', u.nom) AS user,
         'a ajouté une ressource' AS action,
         r.titre AS ressource,
         r.created_at AS created_at
       FROM resources r
       JOIN users u ON u.id = r.user_id
       WHERE r.is_active = TRUE

       UNION ALL

       SELECT
         CONCAT('utilisateur-', u.id),
         'nouveau_utilisateur',
         CONCAT(u.prenom, ' ', u.nom),
         's''est inscrit',
         NULL,
         u.created_at
       FROM users u

       UNION ALL

       SELECT
         CONCAT('moderation-', r.id),
         CASE WHEN r.status = 'validee' THEN 'validation' ELSE 'refus' END,
         COALESCE(CONCAT(a.prenom, ' ', a.nom), 'Administration'),
         CASE WHEN r.status = 'validee' THEN 'a validé' ELSE 'a refusé' END,
         r.titre,
         r.moderated_at
       FROM resources r
       LEFT JOIN users a ON a.id = r.moderated_by
       WHERE r.moderated_at IS NOT NULL
     ) AS journal
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const totalRows = await query(
    `SELECT
       (SELECT COUNT(*) FROM resources WHERE is_active = TRUE)
       + (SELECT COUNT(*) FROM users)
       + (SELECT COUNT(*) FROM resources WHERE moderated_at IS NOT NULL) AS total`
  );

  return apiResponse(res, 200, true, 'Activité récente', {
    activities: activites,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// FILE DE MODÉRATION
// @route GET /api/v1/admin/pending
// @access Private/Admin
// ============================================
export const getPendingActions = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const ressources = await query(
    `SELECT
       r.id, r.titre, r.type, r.description, r.auteur, r.niveau, r.filiere,
       r.annee_academique, r.file_url, r.file_name, r.created_at,
       c.nom AS matiere,
       u.id AS user_id, CONCAT(u.prenom, ' ', u.nom) AS auteur_compte, u.email AS auteur_email
     FROM resources r
     LEFT JOIN categories c ON c.id = r.category_id
     JOIN users u ON u.id = r.user_id
     WHERE r.status = 'en_attente' AND r.is_active = TRUE
     ORDER BY r.created_at ASC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const totalRows = await query(
    "SELECT COUNT(*) AS total FROM resources WHERE status = 'en_attente' AND is_active = TRUE"
  );

  return apiResponse(res, 200, true, 'File de modération', {
    resources: ressources,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

export default { getDashboardStats, getRecentActivity, getPendingActions };
