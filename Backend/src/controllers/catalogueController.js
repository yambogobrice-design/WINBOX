import { query } from '../config/database.js';
import { apiResponse, asyncHandler } from '../utils/helpers.js';
import { resoudreCategorie } from '../utils/categories.js';
import ApiError from '../utils/ApiError.js';

// ============================================
// CATALOGUE DES MATIÈRES
// @route GET /api/v1/categories
// @access Public
// ============================================
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await query(
    `SELECT
       c.id, c.nom, c.slug, c.description, c.icon, c.ordre,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE) AS ressources
     FROM categories c
     WHERE c.is_active = TRUE
     ORDER BY c.ordre ASC, c.nom ASC`
  );

  return apiResponse(res, 200, true, 'Matières récupérées', { categories });
});

// ============================================
// DÉTAIL D'UNE MATIÈRE
// @route GET /api/v1/categories/:slug
// @access Public
// ============================================
export const getCategorie = asyncHandler(async (req, res) => {
  const identifiant = req.params.slug;
  const categoryId = await resoudreCategorie(identifiant);

  if (!categoryId) {
    throw ApiError.notFound('Matière non trouvée');
  }

  const rows = await query(
    `SELECT
       c.id, c.nom, c.slug, c.description, c.icon,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE) AS ressources,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE AND r.type = 'livre') AS livres,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE AND r.type = 'cours') AS cours,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE AND r.type = 'sujet') AS sujets,
       (SELECT COUNT(*) FROM resources r
         WHERE r.category_id = c.id AND r.status = 'validee' AND r.is_active = TRUE AND r.type = 'correction') AS corrections
     FROM categories c
     WHERE c.id = ?`,
    [categoryId]
  );

  return apiResponse(res, 200, true, 'Matière récupérée', { category: rows[0] });
});

// ============================================
// CATALOGUE DES BADGES
// @route GET /api/v1/badges
// @access Public
// ============================================
export const getBadges = asyncHandler(async (req, res) => {
  const badges = await query(
    `SELECT id, nom, slug, description, icon, condition_type, condition_valeur, ordre
     FROM badges
     WHERE is_active = TRUE
     ORDER BY ordre ASC, nom ASC`
  );

  return apiResponse(res, 200, true, 'Badges récupérés', { badges });
});

// ============================================
// MES BADGES
// @route GET /api/v1/badges/me
// @access Private
// ============================================
export const getMyBadges = asyncHandler(async (req, res) => {
  const badges = await query(
    `SELECT
       b.id, b.nom, b.slug, b.description, b.icon, b.condition_type, b.condition_valeur,
       (ub.id IS NOT NULL) AS obtenu,
       ub.obtained_at
     FROM badges b
     LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = ?
     WHERE b.is_active = TRUE
     ORDER BY obtenu DESC, b.ordre ASC`,
    [req.user.id]
  );

  const obtenus = badges.filter((badge) => badge.obtenu).length;

  return apiResponse(res, 200, true, 'Badges récupérés', {
    badges,
    progression: { obtenus, total: badges.length }
  });
});

export default { getCategories, getCategorie, getBadges, getMyBadges };
