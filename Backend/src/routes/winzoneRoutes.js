import express from 'express';
import { body, query } from 'express-validator';
import {
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
} from '../controllers/winzoneController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, idValide } from '../middlewares/validation.js';

const router = express.Router();

router.use(authenticate);

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

// --- Vue d'ensemble ---
router.get('/overview', getOverview);

// --- Objectifs ---
router.get('/objectives', reglesListe, getObjectives);
router.post(
  '/objectives',
  body('titre').trim().isLength({ min: 3 }).withMessage('Le titre est requis (3 caractères minimum)'),
  body('objectifHeures').optional().isInt({ min: 0, max: 1000 }).withMessage('Nombre d\'heures invalide'),
  body('dateEcheance').optional({ values: 'falsy' }).isISO8601().withMessage('Date d\'échéance invalide'),
  validate,
  createObjective
);
router.patch(
  '/objectives/:id',
  idValide,
  body('progression').optional().isInt({ min: 0, max: 100 }).withMessage('La progression doit être comprise entre 0 et 100'),
  body('statut').optional().isIn(['en_cours', 'termine', 'en_retard']).withMessage('Statut invalide'),
  validate,
  updateObjective
);
router.delete('/objectives/:id', idValide, deleteObjective);

// --- Matières travaillées et recommandations ---
router.get('/subjects', getSubjects);
router.get('/recommendations', getRecommendedSubjects);

// --- Défis ---
router.get('/challenges', getChallenges);
router.post('/challenges/:id/join', idValide, joinChallenge);
router.patch(
  '/challenges/:id/progress',
  idValide,
  body('progression').isInt({ min: 0 }).withMessage('Progression invalide'),
  validate,
  updateChallengeProgress
);

// --- Sessions d'étude ---
router.get('/sessions', reglesListe, getStudySessions);
router.post(
  '/sessions',
  body('dureeMinutes').isInt({ min: 1, max: 1440 }).withMessage('Durée invalide (1 à 1440 minutes)'),
  body('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date invalide'),
  validate,
  createStudySession
);
router.delete('/sessions/:id', idValide, deleteStudySession);

export default router;
