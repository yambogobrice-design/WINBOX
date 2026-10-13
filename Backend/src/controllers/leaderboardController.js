import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata, periodeEnJours } from '../utils/helpers.js';
import { resoudreCategorie } from '../utils/categories.js';
import ApiError from '../utils/ApiError.js';

/**
 * Classement (WinRank).
 * Deux métriques selon la période choisie :
 *   - « Tout temps »  : points cumulés de l'utilisateur (users.points)
 *   - période bornée  : points gagnés sur la période (table activities)
 * Le filtre matière s'applique dans les deux cas.
 */

const VALEURS_GENERAL = ['general', 'général', 'tous', 'toutes', ''];

const construireBaseClassement = (categoryId, jours) => {
  const params = [];

  // Expression « points »
  let expressionPoints = 'u.points';

  if (jours !== null) {
    const filtres = ['a.user_id = u.id', 'a.points > 0', 'a.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)'];
    params.push(jours);

    if (categoryId) {
      filtres.push('a.category_id = ?');
      params.push(categoryId);
    }

    expressionPoints = `COALESCE((SELECT SUM(a.points) FROM activities a WHERE ${filtres.join(' AND ')}), 0)`;
  }

  // Statistiques de quiz (une seule occurrence des paramètres)
  const filtresQuiz = ['qa.user_id = u.id'];

  if (jours !== null) {
    filtresQuiz.push('qa.completed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)');
    params.push(jours);
  }

  if (categoryId) {
    filtresQuiz.push('qz.category_id = ?');
    params.push(categoryId);
  }

  const sql = `
    SELECT
      u.id,
      CONCAT(u.prenom, ' ', u.nom) AS nom,
      u.niveau,
      u.filiere,
      u.role,
      u.points AS pointsTotal,
      ${expressionPoints} AS points,
      COALESCE(q.quizCompletes, 0) AS quizCompletes,
      COALESCE(q.tauxReussite, 0) AS tauxReussite
    FROM users u
    LEFT JOIN (
      SELECT
        qa.user_id,
        COUNT(*) AS quizCompletes,
        ROUND(AVG(qa.percentage)) AS tauxReussite
      FROM quiz_attempts qa
      JOIN quiz qz ON qz.id = qa.quiz_id
      WHERE ${filtresQuiz.join(' AND ')}
      GROUP BY qa.user_id
    ) q ON q.user_id = u.id
    WHERE u.status = 'actif'
  `;

  return { sql, params };
};

// Convertit la matière reçue (libellé ou slug) en identifiant, « Général » => null
const resoudreMatiereFiltre = async (matiere) => {
  if (!matiere || VALEURS_GENERAL.includes(String(matiere).toLowerCase())) return null;
  return resoudreCategorie(matiere);
};

// ============================================
// CLASSEMENT
// @route GET /api/v1/leaderboard?matiere=Mathématiques&periode=Ce mois&limit=10
// @access Public (auth optionnelle : renseigne « moi »)
// ============================================
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 100);
  const categoryId = await resoudreMatiereFiltre(req.query.matiere);
  const jours = periodeEnJours(req.query.periode, 30);

  const { sql: base, params } = construireBaseClassement(categoryId, jours);

  const classement = await query(
    `SELECT * FROM (${base}) AS c
     ORDER BY c.points DESC, c.pointsTotal DESC, c.id ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM (${base}) AS c`, params);

  const rangs = classement.map((ligne, index) => ({ ...ligne, rang: offset + index + 1 }));

  let moi = null;

  if (req.user) {
    const mesStats = await query(`SELECT * FROM (${base}) AS c WHERE c.id = ?`, [...params, req.user.id]);

    if (mesStats.length > 0) {
      const miennes = mesStats[0];

      const rangRows = await query(
        `SELECT COUNT(*) + 1 AS rang
         FROM (${base}) AS c
         WHERE (c.points > ?)
            OR (c.points = ? AND c.pointsTotal > ?)
            OR (c.points = ? AND c.pointsTotal = ? AND c.id < ?)`,
        [
          ...params,
          miennes.points, miennes.points, miennes.pointsTotal,
          miennes.points, miennes.pointsTotal, miennes.id
        ]
      );

      moi = { ...miennes, rang: Number(rangRows[0]?.rang) || 1 };
    }
  }

  return apiResponse(res, 200, true, 'Classement récupéré', {
    classement: rangs,
    moi,
    filtres: {
      matiere: req.query.matiere || 'Général',
      matiere_id: categoryId,
      periode: req.query.periode || 'Ce mois',
      jours
    },
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// MON CLASSEMENT
// @route GET /api/v1/leaderboard/me
// @access Private
// ============================================
export const getMyRank = asyncHandler(async (req, res) => {
  const categoryId = await resoudreMatiereFiltre(req.query.matiere);
  const jours = periodeEnJours(req.query.periode, 30);

  const { sql: base, params } = construireBaseClassement(categoryId, jours);

  const mesStats = await query(`SELECT * FROM (${base}) AS c WHERE c.id = ?`, [...params, req.user.id]);

  if (mesStats.length === 0) {
    throw ApiError.notFound('Utilisateur non classé (compte inactif)');
  }

  const miennes = mesStats[0];

  const rangRows = await query(
    `SELECT COUNT(*) + 1 AS rang
     FROM (${base}) AS c
     WHERE (c.points > ?)
        OR (c.points = ? AND c.pointsTotal > ?)
        OR (c.points = ? AND c.pointsTotal = ? AND c.id < ?)`,
    [
      ...params,
      miennes.points, miennes.points, miennes.pointsTotal,
      miennes.points, miennes.pointsTotal, miennes.id
    ]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM (${base}) AS c`, params);

  return apiResponse(res, 200, true, 'Mon classement', {
    moi: { ...miennes, rang: Number(rangRows[0]?.rang) || 1 },
    total_classes: Number(totalRows[0]?.total) || 0,
    filtres: {
      matiere: req.query.matiere || 'Général',
      matiere_id: categoryId,
      periode: req.query.periode || 'Ce mois',
      jours
    }
  });
});

export default { getLeaderboard, getMyRank };
