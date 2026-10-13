import path from 'path';
import fs from 'fs';
import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata, buildOrderBy } from '../utils/helpers.js';
import { resoudreCategorie } from '../utils/categories.js';
import { ajouterPoints, BAREME } from '../utils/gamification.js';
import { creerNotification } from '../utils/notifications.js';
import { supprimerFichier, dossierUploads } from '../middlewares/upload.js';
import ApiError from '../utils/ApiError.js';

const TYPES_VALIDES = ['livre', 'cours', 'sujet', 'correction', 'support'];
const STATUTS_VALIDES = ['en_attente', 'validee', 'refusee'];

// Valeurs « sentinelles » des filtres du frontend (menus déroulants)
const FILTRES_IGNORES = ['tous', 'toutes', '', null, undefined];

const COLONNES_SELECT = `
  r.id, r.titre, r.description, r.type, r.auteur, r.niveau, r.filiere,
  r.annee_academique, r.file_url, r.file_name, r.file_size, r.file_type,
  r.thumbnail_url, r.download_count, r.view_count, r.rating_avg, r.rating_count,
  r.status, r.moderation_comment, r.tags, r.created_at, r.updated_at,
  r.user_id,
  c.id AS category_id, c.nom AS matiere, c.slug AS matiere_slug,
  CONCAT(u.prenom, ' ', u.nom) AS uploader
`;

// Filtres communs aux listes (publiques et administration)
const construireFiltres = (requete, { visibilitePublique = true } = {}) => {
  const conditions = [];
  const params = [];

  if (visibilitePublique) {
    conditions.push("r.status = 'validee'", 'r.is_active = TRUE');
  } else if (!FILTRES_IGNORES.includes(requete.status) && requete.status !== 'tous') {
    if (!STATUTS_VALIDES.includes(requete.status)) {
      throw ApiError.badRequest(`Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}`);
    }
    conditions.push('r.status = ?');
    params.push(requete.status);
  }

  if (requete.include_inactive !== 'true') {
    conditions.push('r.is_active = TRUE');
  }

  if (!FILTRES_IGNORES.includes(requete.type)) {
    conditions.push('r.type = ?');
    params.push(requete.type);
  }

  if (!FILTRES_IGNORES.includes(requete.matiere)) {
    conditions.push('(c.slug = ? OR c.nom = ?)');
    params.push(String(requete.matiere).toLowerCase(), requete.matiere);
  }

  if (!FILTRES_IGNORES.includes(requete.category_id)) {
    conditions.push('r.category_id = ?');
    params.push(requete.category_id);
  }

  if (!FILTRES_IGNORES.includes(requete.niveau)) {
    conditions.push('r.niveau = ?');
    params.push(requete.niveau);
  }

  if (!FILTRES_IGNORES.includes(requete.filiere)) {
    conditions.push('r.filiere LIKE ?');
    params.push(`%${requete.filiere}%`);
  }

  if (!FILTRES_IGNORES.includes(requete.annee)) {
    conditions.push('r.annee_academique = ?');
    params.push(requete.annee);
  }

  if (!FILTRES_IGNORES.includes(requete.user_id)) {
    conditions.push('r.user_id = ?');
    params.push(requete.user_id);
  }

  if (!FILTRES_IGNORES.includes(requete.search)) {
    conditions.push('(r.titre LIKE ? OR r.description LIKE ? OR r.auteur LIKE ?)');
    const motif = `%${requete.search}%`;
    params.push(motif, motif, motif);
  }

  if (requete.exclude_id) {
    conditions.push('r.id <> ?');
    params.push(requete.exclude_id);
  }

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

const TRI_AUTORISE = {
  recent: 'r.created_at',
  ancien: 'r.created_at',
  populaire: 'r.download_count',
  telechargements: 'r.download_count',
  vues: 'r.view_count',
  note: 'r.rating_avg',
  titre: 'r.titre'
};

// ============================================
// LISTE DES RESSOURCES
// @route GET /api/v1/resources
// @access Public (auth optionnelle : renseigne is_favorite)
// ============================================
export const getResources = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);
  const { where, params } = construireFiltres(req.query, { visibilitePublique: true });
  const orderBy = buildOrderBy(req.query.sort, TRI_AUTORISE, 'r.created_at DESC');
  const userId = req.user?.id || 0;

  const ressources = await query(
    `SELECT ${COLONNES_SELECT},
            (SELECT COUNT(*) FROM favorites f WHERE f.resource_id = r.id AND f.user_id = ?) > 0 AS is_favorite
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     ${where}
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [userId, ...params, limit, offset]
  );

  const totalRows = await query(
    `SELECT COUNT(*) AS total
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     ${where}`,
    params
  );

  return apiResponse(res, 200, true, 'Ressources récupérées', {
    resources: ressources,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// RESSOURCES DE L'UTILISATEUR CONNECTÉ
// @route GET /api/v1/resources/mine
// @access Private
// ============================================
export const getMyResources = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const conditions = ['r.user_id = ?', 'r.is_active = TRUE'];
  const params = [req.user.id];

  if (!FILTRES_IGNORES.includes(req.query.status)) {
    conditions.push('r.status = ?');
    params.push(req.query.status);
  }

  const ressources = await query(
    `SELECT ${COLONNES_SELECT}
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const statsRows = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'validee') AS validees,
       SUM(status = 'en_attente') AS en_attente,
       SUM(status = 'refusee') AS refusees
     FROM resources
     WHERE user_id = ? AND is_active = TRUE`,
    [req.user.id]
  );

  const stats = statsRows[0] || {};

  return apiResponse(res, 200, true, 'Vos ressources', {
    resources: ressources,
    stats: {
      total: Number(stats.total) || 0,
      validees: Number(stats.validees) || 0,
      en_attente: Number(stats.en_attente) || 0,
      refusees: Number(stats.refusees) || 0
    }
  });
});

// ============================================
// DÉTAIL D'UNE RESSOURCE
// @route GET /api/v1/resources/:id
// @access Public
// ============================================
export const getResourceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 0;

  const rows = await query(
    `SELECT ${COLONNES_SELECT},
            (SELECT COUNT(*) FROM favorites f WHERE f.resource_id = r.id AND f.user_id = ?) > 0 AS is_favorite
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ? AND r.is_active = TRUE`,
    [userId, id]
  );

  if (rows.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  const ressource = rows[0];

  // Une ressource non validée n'est visible que par son auteur et les admins
  const estProprietaire = req.user && req.user.id === ressource.user_id;
  const estAdmin = req.user?.role === 'admin';

  if (ressource.status !== 'validee' && !estProprietaire && !estAdmin) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  await query('UPDATE resources SET view_count = view_count + 1 WHERE id = ?', [id]);

  const similaires = await query(
    `SELECT r.id, r.titre, r.type, r.download_count, r.created_at,
            c.nom AS matiere, CONCAT(u.prenom, ' ', u.nom) AS uploader
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     WHERE r.status = 'validee' AND r.is_active = TRUE AND r.id <> ?
       AND (r.category_id = ? OR r.niveau = ?)
     ORDER BY r.download_count DESC
     LIMIT 4`,
    [id, ressource.category_id, ressource.niveau]
  );

  return apiResponse(res, 200, true, 'Ressource récupérée', {
    resource: ressource,
    similaires
  });
});

// ============================================
// CRÉATION (contribution)
// @route POST /api/v1/resources
// @access Private (multipart/form-data, champ « fichier »)
// ============================================
export const createResource = asyncHandler(async (req, res) => {
  const {
    titre,
    description = null,
    type,
    auteur = null,
    matiere = null,
    niveau = null,
    filiere = null,
    annee_academique = null,
    tags = null
  } = req.body;

  if (!titre || String(titre).trim().length < 3) {
    supprimerFichier(req.file?.filename);
    throw ApiError.badRequest('Le titre est requis (3 caractères minimum)');
  }

  if (!TYPES_VALIDES.includes(type)) {
    supprimerFichier(req.file?.filename);
    throw ApiError.badRequest(`Type de ressource invalide. Valeurs acceptées : ${TYPES_VALIDES.join(', ')}`);
  }

  let categoryId = null;
  try {
    categoryId = await resoudreCategorie(matiere);
  } catch (error) {
    supprimerFichier(req.file?.filename);
    throw error;
  }

  let tagsJson = null;
  if (tags !== null && tags !== undefined && tags !== '') {
    try {
      tagsJson = JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(tags));
    } catch {
      supprimerFichier(req.file?.filename);
      throw ApiError.badRequest('Le champ « tags » doit être un tableau JSON');
    }
  }

  // Un administrateur publie directement, un utilisateur passe en modération
  const status = req.user.role === 'admin' ? 'validee' : 'en_attente';

  const resultat = await query(
    `INSERT INTO resources
       (titre, description, type, auteur, category_id, user_id, niveau, filiere,
        annee_academique, file_url, file_name, file_size, file_type, tags, status,
        moderated_by, moderated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      String(titre).trim(),
      description,
      type,
      auteur,
      categoryId,
      req.user.id,
      niveau,
      filiere,
      annee_academique,
      req.file ? `/uploads/${req.file.filename}` : null,
      req.file ? req.file.originalname : null,
      req.file ? req.file.size : null,
      req.file ? req.file.mimetype : null,
      tagsJson,
      status,
      req.user.role === 'admin' ? req.user.id : null,
      req.user.role === 'admin' ? new Date() : null
    ]
  );

  const { points } = await ajouterPoints(req.user.id, {
    type: 'contribution',
    titre: `Contribution : ${String(titre).trim()}`,
    points: BAREME.contribution_soumise,
    categoryId,
    resourceId: resultat.insertId
  });

  if (status === 'en_attente') {
    await creerNotification(req.user.id, {
      type: 'contribution',
      titre: 'Contribution reçue',
      message: `« ${String(titre).trim()} » a été transmise pour validation.`,
      link: '/Profil'
    });
  }

  const rows = await query(
    `SELECT ${COLONNES_SELECT}
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?`,
    [resultat.insertId]
  );

  return apiResponse(res, 201, true, 'Ressource créée avec succès', {
    resource: rows[0],
    points,
    message_moderation: status === 'en_attente'
      ? 'Votre contribution sera examinée par notre équipe avant publication.'
      : undefined
  });
});

// ============================================
// MISE À JOUR
// @route PUT /api/v1/resources/:id
// @access Private (auteur ou admin)
// ============================================
export const updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rows = await query('SELECT id, user_id, status, file_url FROM resources WHERE id = ? AND is_active = TRUE', [id]);
  if (rows.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  const ressource = rows[0];
  const estProprietaire = ressource.user_id === req.user.id;
  const estAdmin = req.user.role === 'admin';

  if (!estProprietaire && !estAdmin) {
    throw ApiError.forbidden('Non autorisé à modifier cette ressource');
  }

  const { titre, description, type, auteur, matiere, niveau, filiere, annee_academique, tags } = req.body;

  const champs = {};

  if (titre !== undefined) champs.titre = String(titre).trim();
  if (description !== undefined) champs.description = description;
  if (auteur !== undefined) champs.auteur = auteur;
  if (niveau !== undefined) champs.niveau = niveau;
  if (filiere !== undefined) champs.filiere = filiere;
  if (annee_academique !== undefined) champs.annee_academique = annee_academique;

  if (type !== undefined) {
    if (!TYPES_VALIDES.includes(type)) {
      throw ApiError.badRequest(`Type de ressource invalide. Valeurs acceptées : ${TYPES_VALIDES.join(', ')}`);
    }
    champs.type = type;
  }

  if (matiere !== undefined) {
    champs.category_id = await resoudreCategorie(matiere);
  }

  if (tags !== undefined) {
    try {
      champs.tags = JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(tags));
    } catch {
      throw ApiError.badRequest('Le champ « tags » doit être un tableau JSON');
    }
  }

  if (Object.keys(champs).length === 0) {
    throw ApiError.badRequest('Aucun champ à mettre à jour');
  }

  // Une ressource validée modifiée par son auteur repasse en modération
  if (!estAdmin && ressource.status === 'validee') {
    champs.status = 'en_attente';
    champs.moderation_comment = null;
    champs.moderated_by = null;
    champs.moderated_at = null;
  }

  const set = Object.keys(champs).map((champ) => `${champ} = ?`).join(', ');
  await query(`UPDATE resources SET ${set} WHERE id = ?`, [...Object.values(champs), id]);

  const miseAJour = await query(
    `SELECT ${COLONNES_SELECT}
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?`,
    [id]
  );

  return apiResponse(res, 200, true, 'Ressource mise à jour avec succès', {
    resource: miseAJour[0],
    remise_en_moderation: champs.status === 'en_attente' && ressource.status === 'validee'
  });
});

// ============================================
// SUPPRESSION (logique)
// @route DELETE /api/v1/resources/:id
// @access Private (auteur ou admin)
// ============================================
export const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rows = await query('SELECT id, user_id FROM resources WHERE id = ? AND is_active = TRUE', [id]);
  if (rows.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  const estProprietaire = rows[0].user_id === req.user.id;
  if (!estProprietaire && req.user.role !== 'admin') {
    throw ApiError.forbidden('Non autorisé à supprimer cette ressource');
  }

  await query('UPDATE resources SET is_active = FALSE WHERE id = ?', [id]);

  return apiResponse(res, 200, true, 'Ressource supprimée avec succès');
});

// ============================================
// TÉLÉCHARGEMENT (enregistrement + points)
// ============================================
const enregistrerTelechargement = async (req, ressource) => {
  await query(
    'INSERT INTO downloads (user_id, resource_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [req.user.id, ressource.id, req.ip, req.get('user-agent') || null]
  );

  await query('UPDATE resources SET download_count = download_count + 1 WHERE id = ?', [ressource.id]);

  const { points } = await ajouterPoints(req.user.id, {
    type: 'telechargement',
    titre: `Téléchargement : ${ressource.titre}`,
    points: BAREME.telechargement,
    categoryId: ressource.category_id,
    resourceId: ressource.id
  });

  return points;
};

const chargerPourTelechargement = async (id) => {
  const rows = await query(
    'SELECT id, titre, category_id, file_url, file_name, status FROM resources WHERE id = ? AND is_active = TRUE',
    [id]
  );

  if (rows.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  if (rows[0].status !== 'validee') {
    throw ApiError.forbidden('Cette ressource n\'est pas encore publiée');
  }

  if (!rows[0].file_url) {
    throw ApiError.badRequest('Aucun fichier n\'est associé à cette ressource');
  }

  return rows[0];
};

// @route POST /api/v1/resources/:id/download
// @access Private
export const downloadResource = asyncHandler(async (req, res) => {
  const ressource = await chargerPourTelechargement(req.params.id);
  const points = await enregistrerTelechargement(req, ressource);

  return apiResponse(res, 200, true, 'Téléchargement enregistré', {
    file_url: ressource.file_url,
    file_name: ressource.file_name,
    points
  });
});

// @route GET /api/v1/resources/:id/file
// @access Private — envoie directement le fichier
export const telechargerFichier = asyncHandler(async (req, res) => {
  const ressource = await chargerPourTelechargement(req.params.id);
  await enregistrerTelechargement(req, ressource);

  const nomFichier = path.basename(ressource.file_url);
  const chemin = path.join(dossierUploads, nomFichier);

  if (!fs.existsSync(chemin)) {
    throw ApiError.notFound('Fichier introuvable sur le serveur');
  }

  return res.download(chemin, ressource.file_name || nomFichier);
});

// ============================================
// MODÉRATION : LISTE COMPLÈTE
// @route GET /api/v1/admin/resources
// @access Private/Admin
// ============================================
export const getResourcesAdmin = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);
  const { where, params } = construireFiltres(req.query, { visibilitePublique: false });
  const orderBy = buildOrderBy(req.query.sort, TRI_AUTORISE, 'r.created_at DESC');

  const ressources = await query(
    `SELECT ${COLONNES_SELECT}
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     ${where}
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(
    `SELECT COUNT(*) AS total
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     ${where}`,
    params
  );

  const statsRows = await query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'validee') AS validees,
       SUM(status = 'en_attente') AS en_attente,
       SUM(status = 'refusee') AS refusees,
       COALESCE(SUM(download_count), 0) AS telechargements
     FROM resources
     WHERE is_active = TRUE`
  );

  const stats = statsRows[0] || {};

  return apiResponse(res, 200, true, 'Ressources (administration)', {
    resources: ressources,
    stats: {
      total: Number(stats.total) || 0,
      validees: Number(stats.validees) || 0,
      en_attente: Number(stats.en_attente) || 0,
      refusees: Number(stats.refusees) || 0,
      telechargements: Number(stats.telechargements) || 0
    },
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// MODÉRATION
// @route PATCH /api/v1/admin/resources/:id/status
// @access Private/Admin
// ============================================
export const modererRessource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comment = null } = req.body;

  if (!STATUTS_VALIDES.includes(status)) {
    throw ApiError.badRequest(`Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}`);
  }

  if (status === 'refusee' && !comment) {
    throw ApiError.badRequest('Un motif est requis pour refuser une ressource');
  }

  const rows = await query(
    `SELECT r.id, r.titre, r.user_id, r.status, r.category_id, r.file_url, r.file_name, r.file_size, r.file_type
     FROM resources r
     WHERE r.id = ? AND r.is_active = TRUE`,
    [id]
  );

  if (rows.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  const ressource = rows[0];

  await query(
    `UPDATE resources
     SET status = ?, moderation_comment = ?, moderated_by = ?, moderated_at = NOW()
     WHERE id = ?`,
    [status, comment, req.user.id, id]
  );

  // Le dépôt devient une contribution validée : points + notification à l'auteur
  if (status === 'validee' && ressource.status !== 'validee') {
    await ajouterPoints(ressource.user_id, {
      type: 'contribution',
      titre: `Contribution validée : ${ressource.titre}`,
      points: BAREME.contribution_validee,
      categoryId: ressource.category_id,
      resourceId: ressource.id
    });

    await creerNotification(ressource.user_id, {
      type: 'contribution',
      titre: 'Contribution validée',
      message: `« ${ressource.titre} » est désormais publiée sur WinBox.`,
      link: '/Profil'
    });
  }

  if (status === 'refusee') {
    await creerNotification(ressource.user_id, {
      type: 'contribution',
      titre: 'Contribution refusée',
      message: `« ${ressource.titre} » n'a pas été retenue. Motif : ${comment}`,
      link: '/Profil'
    });
  }

  return apiResponse(res, 200, true, `Statut mis à jour : ${status}`);
});

export default {
  getResources,
  getMyResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  telechargerFichier,
  getResourcesAdmin,
  modererRessource
};
