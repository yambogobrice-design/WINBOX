import { query } from '../config/database.js';
import { creerNotification } from './notifications.js';

/**
 * Gamification : barème de points, fil d'activité et attribution des badges.
 * Source unique de vérité pour les valeurs de points.
 */

// ============================================
// BARÈME
// ============================================
export const BAREME = {
  inscription: 20,
  telechargement: 1,
  quiz: 10,
  contribution_soumise: 5,
  contribution_validee: 50
};

// ============================================
// BADGES
// ============================================

// Statistiques nécessaires à l'évaluation des conditions de badge
const recupererStatsBadges = async (userId) => {
  const rows = await query(
    `SELECT
       u.points,
       (SELECT COUNT(*) FROM resources r
         WHERE r.user_id = u.id AND r.status = 'validee' AND r.is_active = TRUE) AS contributions,
       (SELECT COUNT(*) FROM downloads d WHERE d.user_id = u.id) AS telechargements,
       (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS quiz,
       (SELECT ROUND(AVG(qa.percentage)) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS taux_reussite
     FROM users u
     WHERE u.id = ?`,
    [userId]
  );

  return rows[0] || null;
};

/**
 * Attribue à l'utilisateur les badges dont il remplit désormais la condition.
 * Idempotent : `user_badges` porte une clé unique (user_id, badge_id).
 * @returns {Promise<Array>} les badges nouvellement obtenus
 */
export const verifierEtAttribuerBadges = async (userId) => {
  const stats = await recupererStatsBadges(userId);
  if (!stats) return [];

  const [badges, dejaObtenus] = await Promise.all([
    query('SELECT * FROM badges WHERE is_active = TRUE ORDER BY ordre ASC'),
    query('SELECT badge_id FROM user_badges WHERE user_id = ?', [userId])
  ]);

  const obtenus = new Set(dejaObtenus.map((ligne) => ligne.badge_id));

  const valeurs = {
    points: Number(stats.points) || 0,
    contributions: Number(stats.contributions) || 0,
    telechargements: Number(stats.telechargements) || 0,
    quiz: Number(stats.quiz) || 0,
    taux_reussite: Number(stats.taux_reussite) || 0
  };

  const nouveaux = [];

  for (const badge of badges) {
    if (obtenus.has(badge.id)) continue;

    const valeur = valeurs[badge.condition_type] ?? 0;
    if (valeur < badge.condition_valeur) continue;

    await query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badge.id]);
    await creerNotification(userId, {
      type: 'badge',
      titre: 'Nouveau badge débloqué',
      message: `Vous avez obtenu le badge « ${badge.nom} » : ${badge.description}`,
      link: '/Profil'
    });

    nouveaux.push(badge);
  }

  return nouveaux;
};

// ============================================
// POINTS + FIL D'ACTIVITÉ
// ============================================

/**
 * Ajoute des points à un utilisateur et trace l'activité correspondante.
 * L'activité alimente « Activité récente » du profil.
 *
 * @param {number} userId
 * @param {object} options
 * @param {string} options.type        inscription | quiz | telechargement | contribution | objectif | defi | badge | session
 * @param {string} options.titre       libellé affiché dans le fil d'activité
 * @param {number} [options.points]    points à créditer (0 = simple trace)
 * @param {number} [options.categoryId]
 * @param {number} [options.resourceId]
 * @param {object} [options.metadata]
 * @param {boolean} [options.verifierBadges] réévaluer les badges après l'ajout
 * @returns {Promise<{points: number, badges: Array}>} total de points et nouveaux badges
 */
export const ajouterPoints = async (userId, {
  type,
  titre,
  points = 0,
  categoryId = null,
  resourceId = null,
  metadata = null,
  verifierBadges = true
} = {}) => {
  if (points > 0) {
    await query('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);
  }

  await query(
    `INSERT INTO activities (user_id, type, titre, points, category_id, resource_id, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, type, titre, points, categoryId, resourceId, metadata ? JSON.stringify(metadata) : null]
  );

  const rows = await query('SELECT points FROM users WHERE id = ?', [userId]);
  const total = rows[0]?.points ?? 0;

  let badges = [];
  if (verifierBadges) {
    try {
      badges = await verifierEtAttribuerBadges(userId);
    } catch (error) {
      console.error('Erreur vérification badges:', error.message);
    }
  }

  return { points: total, badges };
};
