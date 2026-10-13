import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata } from '../utils/helpers.js';
import ApiError from '../utils/ApiError.js';

const COLONNES_FAVORI = `
  f.id AS favorite_id, f.created_at AS ajoute_le,
  r.id, r.titre, r.type, r.auteur, r.niveau, r.filiere, r.annee_academique,
  r.file_url, r.file_name, r.file_size, r.download_count, r.rating_avg,
  r.status, r.created_at,
  c.nom AS matiere, c.slug AS matiere_slug,
  CONCAT(u.prenom, ' ', u.nom) AS uploader
`;

// ============================================
// MES FAVORIS
// @route GET /api/v1/favorites
// @access Private
// ============================================
export const getFavorites = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 100);

  const conditions = ['f.user_id = ?', 'r.is_active = TRUE'];
  const params = [req.user.id];

  const type = req.query.type;
  if (type && !['tous', 'Toutes', 'Toutes'].includes(type)) {
    conditions.push('r.type = ?');
    params.push(type);
  }

  const matiere = req.query.matiere;
  if (matiere && !['toutes', 'tous', 'Toutes', 'Tous'].includes(matiere)) {
    conditions.push('(c.slug = ? OR c.nom = ?)');
    params.push(String(matiere).toLowerCase(), matiere);
  }

  const search = req.query.search;
  if (search) {
    conditions.push('(r.titre LIKE ? OR r.auteur LIKE ? OR r.description LIKE ?)');
    const motif = `%${search}%`;
    params.push(motif, motif, motif);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const favoris = await query(
    `SELECT ${COLONNES_FAVORI}
     FROM favorites f
     JOIN resources r ON r.id = f.resource_id
     LEFT JOIN categories c ON r.category_id = c.id
     JOIN users u ON r.user_id = u.id
     ${where}
     ORDER BY f.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(
    `SELECT COUNT(*) AS total
     FROM favorites f
     JOIN resources r ON r.id = f.resource_id
     LEFT JOIN categories c ON r.category_id = c.id
     ${where}`,
    params
  );

  return apiResponse(res, 200, true, 'Favoris récupérés', {
    favorites: favoris,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// AJOUTER UN FAVORI
// @route POST /api/v1/favorites
// @route POST /api/v1/resources/:id/favorite
// @access Private
// ============================================
export const addFavorite = asyncHandler(async (req, res) => {
  const resourceId = req.params.id || req.body.resource_id || req.body.resourceId;

  if (!resourceId) {
    throw ApiError.badRequest('L\'identifiant de la ressource est requis');
  }

  const ressources = await query(
    "SELECT id, titre FROM resources WHERE id = ? AND is_active = TRUE AND status = 'validee'",
    [resourceId]
  );

  if (ressources.length === 0) {
    throw ApiError.notFound('Ressource non trouvée');
  }

  const existant = await query('SELECT id FROM favorites WHERE user_id = ? AND resource_id = ?', [req.user.id, resourceId]);

  if (existant.length > 0) {
    return apiResponse(res, 200, true, 'Cette ressource est déjà dans vos favoris', {
      favorite_id: existant[0].id,
      deja_present: true
    });
  }

  const resultat = await query('INSERT INTO favorites (user_id, resource_id) VALUES (?, ?)', [req.user.id, resourceId]);

  return apiResponse(res, 201, true, 'Ressource ajoutée à vos favoris', {
    favorite_id: resultat.insertId,
    resource: { id: Number(resourceId), titre: ressources[0].titre }
  });
});

// ============================================
// RETIRER UN FAVORI
// @route DELETE /api/v1/favorites/:id
// @access Private
// ============================================
export const removeFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // `id` peut être l'identifiant du favori ou celui de la ressource
  const resultat = await query(
    `DELETE FROM favorites
     WHERE user_id = ? AND (id = ? OR resource_id = ?)`,
    [req.user.id, id, id]
  );

  if (resultat.affectedRows === 0) {
    throw ApiError.notFound('Favori non trouvé');
  }

  return apiResponse(res, 200, true, 'Ressource retirée de vos favoris');
});

// ============================================
// VIDER LES FAVORIS
// @route DELETE /api/v1/favorites
// @access Private
// ============================================
export const clearFavorites = asyncHandler(async (req, res) => {
  const resultat = await query('DELETE FROM favorites WHERE user_id = ?', [req.user.id]);

  return apiResponse(res, 200, true, 'Favoris vidés', { supprimes: resultat.affectedRows });
});

export default { getFavorites, addFavorite, removeFavorite, clearFavorites };
