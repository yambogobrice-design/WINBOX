import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata } from '../utils/helpers.js';
import { resoudreCategorie } from '../utils/categories.js';
import { ajouterPoints, BAREME } from '../utils/gamification.js';
import ApiError from '../utils/ApiError.js';

/**
 * WinZone : espace de préparation (objectifs, matières travaillées,
 * sessions d'étude, sujets recommandés, défis).
 */

const STATUTS_OBJECTIF = ['en_cours', 'termine', 'en_retard'];

// Statut affiché : un objectif en cours dont l'échéance est passée est « en retard »
const STATUT_CALCULE = `
  CASE
    WHEN o.statut = 'en_cours' AND o.date_echeance IS NOT NULL AND o.date_echeance < CURDATE() THEN 'en_retard'
    ELSE o.statut
  END AS statut
`;

// ============================================
// VUE D'ENSEMBLE
// @route GET /api/v1/winzone/overview
// @access Private
// ============================================
export const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const rows = await query(
    `SELECT
       (SELECT COALESCE(SUM(duree_minutes), 0) FROM study_sessions WHERE user_id = ?) AS minutes_total,
       (SELECT COALESCE(SUM(duree_minutes), 0) FROM study_sessions
         WHERE user_id = ? AND date_session >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS minutes_7j,
       (SELECT COUNT(*) FROM objectives WHERE user_id = ?) AS objectifs_total,
       (SELECT COUNT(*) FROM objectives WHERE user_id = ? AND statut = 'termine') AS objectifs_termines,
       (SELECT COALESCE(ROUND(AVG(progression)), 0) FROM objectives WHERE user_id = ?) AS progression_moyenne,
       (SELECT COUNT(*) FROM user_challenges uc JOIN challenges c ON c.id = uc.challenge_id
         WHERE uc.user_id = ? AND c.is_active = TRUE) AS defis_total,
       (SELECT COUNT(*) FROM user_challenges uc JOIN challenges c ON c.id = uc.challenge_id
         WHERE uc.user_id = ? AND uc.termine = TRUE) AS defis_termines,
       (SELECT COUNT(DISTINCT category_id) FROM study_sessions WHERE user_id = ? AND category_id IS NOT NULL) AS matieres_suivies`,
    Array(8).fill(userId)
  );

  const stats = rows[0] || {};
  const minutesTotal = Number(stats.minutes_total) || 0;

  return apiResponse(res, 200, true, 'Vue d\'ensemble WinZone', {
    statsGenerales: {
      heuresTotal: Math.round((minutesTotal / 60) * 10) / 10,
      minutesTotal,
      minutes7j: Number(stats.minutes_7j) || 0,
      objectifsTermines: Number(stats.objectifs_termines) || 0,
      objectifsTotal: Number(stats.objectifs_total) || 0,
      progressionMoyenne: Number(stats.progression_moyenne) || 0,
      defisTermines: Number(stats.defis_termines) || 0,
      defisTotal: Number(stats.defis_total) || 0,
      matieresSuivies: Number(stats.matieres_suivies) || 0
    }
  });
});

// ============================================
// OBJECTIFS
// @route GET /api/v1/winzone/objectives
// @access Private
// ============================================
export const getObjectives = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const conditions = ['o.user_id = ?'];
  const params = [req.user.id];

  if (req.query.statut && STATUTS_OBJECTIF.includes(req.query.statut)) {
    conditions.push('o.statut = ?');
    params.push(req.query.statut);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const objectifs = await query(
    `SELECT
       o.id, o.titre, o.date_debut, o.date_echeance, o.objectif_heures,
       o.progression, ${STATUT_CALCULE}, o.created_at,
       c.id AS category_id, c.nom AS matiere, c.slug AS matiere_slug
     FROM objectives o
     LEFT JOIN categories c ON c.id = o.category_id
     ${where}
     ORDER BY
       FIELD(o.statut, 'en_cours', 'en_retard', 'termine'),
       o.date_echeance IS NULL, o.date_echeance ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM objectives o ${where}`, params);

  return apiResponse(res, 200, true, 'Objectifs récupérés', {
    objectives: objectifs,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// @route POST /api/v1/winzone/objectives
// @access Private
export const createObjective = asyncHandler(async (req, res) => {
  const { titre, matiere = null, dateDebut = null, dateEcheance = null, objectifHeures = 0 } = req.body;

  if (!titre || String(titre).trim().length < 3) {
    throw ApiError.badRequest('Le titre de l\'objectif est requis (3 caractères minimum)');
  }

  const categoryId = await resoudreCategorie(matiere);

  const resultat = await query(
    `INSERT INTO objectives (user_id, titre, category_id, date_debut, date_echeance, objectif_heures)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, String(titre).trim(), categoryId, dateDebut, dateEcheance, parseInt(objectifHeures, 10) || 0]
  );

  const rows = await query(
    `SELECT o.id, o.titre, o.date_debut, o.date_echeance, o.objectif_heures, o.progression, ${STATUT_CALCULE},
            c.nom AS matiere, c.slug AS matiere_slug
     FROM objectives o
     LEFT JOIN categories c ON c.id = o.category_id
     WHERE o.id = ?`,
    [resultat.insertId]
  );

  return apiResponse(res, 201, true, 'Objectif créé', { objective: rows[0] });
});

// @route PATCH /api/v1/winzone/objectives/:id
// @access Private
export const updateObjective = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titre, matiere, dateDebut, dateEcheance, objectifHeures, progression, statut } = req.body;

  const rows = await query('SELECT id, statut, titre FROM objectives WHERE id = ? AND user_id = ?', [id, req.user.id]);

  if (rows.length === 0) {
    throw ApiError.notFound('Objectif non trouvé');
  }

  const objectif = rows[0];
  const champs = {};

  if (titre !== undefined) champs.titre = String(titre).trim();
  if (dateDebut !== undefined) champs.date_debut = dateDebut;
  if (dateEcheance !== undefined) champs.date_echeance = dateEcheance;
  if (objectifHeures !== undefined) champs.objectif_heures = parseInt(objectifHeures, 10) || 0;
  if (matiere !== undefined) champs.category_id = await resoudreCategorie(matiere);

  let objectifAtteint = false;

  if (progression !== undefined) {
    const valeur = Math.min(100, Math.max(0, parseInt(progression, 10) || 0));
    champs.progression = valeur;

    if (valeur >= 100) {
      champs.statut = 'termine';
      objectifAtteint = objectif.statut !== 'termine';
    } else if (objectif.statut === 'termine') {
      champs.statut = 'en_cours';
    }
  }

  if (statut !== undefined) {
    if (!STATUTS_OBJECTIF.includes(statut)) {
      throw ApiError.badRequest(`Statut invalide. Valeurs acceptées : ${STATUTS_OBJECTIF.join(', ')}`);
    }
    champs.statut = statut;
    objectifAtteint = statut === 'termine' && objectif.statut !== 'termine';
  }

  if (Object.keys(champs).length === 0) {
    throw ApiError.badRequest('Aucun champ à mettre à jour');
  }

  const set = Object.keys(champs).map((champ) => `${champ} = ?`).join(', ');
  await query(`UPDATE objectives SET ${set} WHERE id = ?`, [...Object.values(champs), id]);

  // Objectif atteint : points + fil d'activité
  if (objectifAtteint) {
    await ajouterPoints(req.user.id, {
      type: 'objectif',
      titre: `Objectif terminé : ${objectif.titre}`,
      points: BAREME.objectif_termine
    });
  }

  const maj = await query(
    `SELECT o.id, o.titre, o.date_debut, o.date_echeance, o.objectif_heures, o.progression, ${STATUT_CALCULE},
            c.nom AS matiere, c.slug AS matiere_slug
     FROM objectives o
     LEFT JOIN categories c ON c.id = o.category_id
     WHERE o.id = ?`,
    [id]
  );

  return apiResponse(res, 200, true, 'Objectif mis à jour', {
    objective: maj[0],
    points_gagnes: objectifAtteint ? BAREME.objectif_termine : 0
  });
});

// @route DELETE /api/v1/winzone/objectives/:id
// @access Private
export const deleteObjective = asyncHandler(async (req, res) => {
  const resultat = await query('DELETE FROM objectives WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

  if (resultat.affectedRows === 0) {
    throw ApiError.notFound('Objectif non trouvé');
  }

  return apiResponse(res, 200, true, 'Objectif supprimé');
});

// ============================================
// MATIÈRES TRAVAILLÉES
// @route GET /api/v1/winzone/subjects
// @access Private
// ============================================
export const getSubjects = asyncHandler(async (req, res) => {
  const matieres = await query(
    `SELECT
       c.id, c.nom, c.slug,
       COALESCE(SUM(ss.duree_minutes), 0) AS minutes_etudiees,
       MAX(ss.date_session) AS dernier_acces,
       COALESCE((
         SELECT SUM(o.objectif_heures) FROM objectives o
         WHERE o.user_id = ? AND o.category_id = c.id
       ), 0) AS objectif_heures,
       COALESCE((
         SELECT ROUND(AVG(o.progression)) FROM objectives o
         WHERE o.user_id = ? AND o.category_id = c.id
       ), 0) AS progression
     FROM study_sessions ss
     JOIN categories c ON c.id = ss.category_id
     WHERE ss.user_id = ?
     GROUP BY c.id, c.nom, c.slug
     ORDER BY minutes_etudiees DESC`,
    [req.user.id, req.user.id, req.user.id]
  );

  return apiResponse(res, 200, true, 'Matières travaillées', {
    subjects: matieres.map((matiere) => ({
      ...matiere,
      heuresEtudiees: Math.round((Number(matiere.minutes_etudiees) / 60) * 10) / 10,
      objectifHeures: Number(matiere.objectif_heures) || 0,
      progression: Number(matiere.progression) || 0,
      filiere: req.user.filiere,
      niveau: req.user.niveau
    }))
  });
});

// ============================================
// SUJETS RECOMMANDÉS
// @route GET /api/v1/winzone/recommendations
// @access Private
// ============================================
export const getRecommendedSubjects = asyncHandler(async (req, res) => {
  const limite = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 6));

  const sujets = await query(
    `SELECT
       r.id, r.titre, r.type, r.niveau, r.annee_academique AS annee, r.download_count,
       c.nom AS matiere, c.slug AS matiere_slug,
       EXISTS(
         SELECT 1 FROM study_sessions ss
         WHERE ss.user_id = ? AND ss.category_id = r.category_id
       ) AS matiere_suivie,
       (r.niveau = ? AND ? IS NOT NULL) AS meme_niveau,
       (r.filiere = ? AND ? IS NOT NULL) AS meme_filiere
     FROM resources r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.status = 'validee' AND r.is_active = TRUE
       AND NOT EXISTS (SELECT 1 FROM downloads d WHERE d.resource_id = r.id AND d.user_id = ?)
     ORDER BY meme_filiere DESC, matiere_suivie DESC, meme_niveau DESC, r.download_count DESC
     LIMIT ?`,
    [req.user.id, req.user.niveau, req.user.niveau, req.user.filiere, req.user.filiere, req.user.id, limite]
  );

  const recommandations = sujets.map((sujet) => {
    const pertinence = Math.min(
      100,
      40
        + (sujet.matiere_suivie ? 25 : 0)
        + (sujet.meme_filiere ? 20 : 0)
        + (sujet.meme_niveau ? 10 : 0)
        + Math.min(10, Math.floor((Number(sujet.download_count) || 0) / 10))
    );

    let raison = 'Ressource populaire de la communauté';
    if (sujet.matiere_suivie) raison = 'Matière que vous travaillez en ce moment';
    else if (sujet.meme_filiere) raison = 'Correspond à votre filière';
    else if (sujet.meme_niveau) raison = 'Adapté à votre niveau d\'études';

    return {
      id: sujet.id,
      titre: sujet.titre,
      type: sujet.type,
      matiere: sujet.matiere,
      niveau: sujet.niveau,
      annee: sujet.annee,
      pertinence,
      raison
    };
  });

  recommandations.sort((a, b) => b.pertinence - a.pertinence);

  return apiResponse(res, 200, true, 'Sujets recommandés', { subjects: recommandations });
});

// ============================================
// DÉFIS
// @route GET /api/v1/winzone/challenges
// @access Private
// ============================================
export const getChallenges = asyncHandler(async (req, res) => {
  const defis = await query(
    `SELECT
       c.id, c.titre, c.description, c.type, c.points, c.objectif,
       c.date_debut, c.date_fin,
       COALESCE(uc.progression, 0) AS progression,
       COALESCE(uc.termine, FALSE) AS termine,
       (uc.id IS NOT NULL) AS rejoint,
       c.date_fin AS expire
     FROM challenges c
     LEFT JOIN user_challenges uc ON uc.challenge_id = c.id AND uc.user_id = ?
     WHERE c.is_active = TRUE
       AND (c.date_fin IS NULL OR c.date_fin >= CURDATE())
     ORDER BY termine ASC, c.date_fin ASC`,
    [req.user.id]
  );

  return apiResponse(res, 200, true, 'Défis récupérés', { challenges: defis });
});

// @route POST /api/v1/winzone/challenges/:id/join
// @access Private
export const joinChallenge = asyncHandler(async (req, res) => {
  const rows = await query(
    'SELECT id, titre FROM challenges WHERE id = ? AND is_active = TRUE',
    [req.params.id]
  );

  if (rows.length === 0) {
    throw ApiError.notFound('Défi non trouvé');
  }

  await query(
    'INSERT IGNORE INTO user_challenges (user_id, challenge_id, progression) VALUES (?, ?, 0)',
    [req.user.id, req.params.id]
  );

  return apiResponse(res, 201, true, 'Défi rejoint', { challenge: rows[0] });
});

// @route PATCH /api/v1/winzone/challenges/:id/progress
// @access Private
export const updateChallengeProgress = asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT c.id, c.titre, c.objectif, c.points, COALESCE(uc.progression, 0) AS progression, COALESCE(uc.termine, FALSE) AS termine
     FROM challenges c
     LEFT JOIN user_challenges uc ON uc.challenge_id = c.id AND uc.user_id = ?
     WHERE c.id = ? AND c.is_active = TRUE`,
    [req.user.id, req.params.id]
  );

  if (rows.length === 0) {
    throw ApiError.notFound('Défi non trouvé');
  }

  const defi = rows[0];
  const progression = Math.max(0, parseInt(req.body.progression, 10) || 0);
  const termine = progression >= defi.objectif && !defi.termine;

  await query(
    `INSERT INTO user_challenges (user_id, challenge_id, progression, termine, completed_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       progression = VALUES(progression),
       termine = VALUES(termine),
       completed_at = COALESCE(VALUES(completed_at), completed_at)`,
    [req.user.id, defi.id, progression, termine || defi.termine, termine ? new Date() : null]
  );

  if (termine) {
    await ajouterPoints(req.user.id, {
      type: 'defi',
      titre: `Défi relevé : ${defi.titre}`,
      points: defi.points || BAREME.defi_termine
    });
  }

  return apiResponse(res, 200, true, 'Progression enregistrée', {
    progression,
    termine: termine || Boolean(defi.termine),
    points_gagnes: termine ? (defi.points || BAREME.defi_termine) : 0
  });
});

// ============================================
// SESSIONS D'ÉTUDE
// @route GET /api/v1/winzone/sessions
// @access Private
// ============================================
export const getStudySessions = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const sessions = await query(
    `SELECT ss.id, ss.duree_minutes, ss.note, ss.date_session, ss.created_at,
            c.id AS category_id, c.nom AS matiere
     FROM study_sessions ss
     LEFT JOIN categories c ON c.id = ss.category_id
     WHERE ss.user_id = ?
     ORDER BY ss.date_session DESC, ss.id DESC
     LIMIT ? OFFSET ?`,
    [req.user.id, limit, offset]
  );

  const totalRows = await query('SELECT COUNT(*) AS total FROM study_sessions WHERE user_id = ?', [req.user.id]);

  return apiResponse(res, 200, true, 'Sessions d\'étude', {
    sessions,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// @route POST /api/v1/winzone/sessions
// @access Private
export const createStudySession = asyncHandler(async (req, res) => {
  const { matiere = null, dureeMinutes, note = null, date = null } = req.body;

  const duree = parseInt(dureeMinutes, 10);
  if (!Number.isInteger(duree) || duree < 1 || duree > 1440) {
    throw ApiError.badRequest('La durée doit être un nombre de minutes entre 1 et 1440');
  }

  const categoryId = await resoudreCategorie(matiere);

  const resultat = await query(
    `INSERT INTO study_sessions (user_id, category_id, duree_minutes, note, date_session)
     VALUES (?, ?, ?, ?, COALESCE(?, CURDATE()))`,
    [req.user.id, categoryId, duree, note, date]
  );

  await ajouterPoints(req.user.id, {
    type: 'session',
    titre: `Session d'étude de ${duree} min`,
    points: BAREME.session_etude,
    categoryId
  });

  const rows = await query(
    `SELECT ss.id, ss.duree_minutes, ss.note, ss.date_session, c.nom AS matiere
     FROM study_sessions ss
     LEFT JOIN categories c ON c.id = ss.category_id
     WHERE ss.id = ?`,
    [resultat.insertId]
  );

  return apiResponse(res, 201, true, 'Session enregistrée', {
    session: rows[0],
    points_gagnes: BAREME.session_etude
  });
});

// @route DELETE /api/v1/winzone/sessions/:id
// @access Private
export const deleteStudySession = asyncHandler(async (req, res) => {
  const resultat = await query('DELETE FROM study_sessions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

  if (resultat.affectedRows === 0) {
    throw ApiError.notFound('Session non trouvée');
  }

  return apiResponse(res, 200, true, 'Session supprimée');
});

export default {
  getOverview,
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  getSubjects,
  getRecommendedSubjects,
  getChallenges,
  joinChallenge,
  updateChallengeProgress,
  getStudySessions,
  createStudySession,
  deleteStudySession
};
