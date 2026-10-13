import express from 'express';
import { query } from 'express-validator';
import { getLeaderboard, getMyRank } from '../controllers/leaderboardController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';

const router = express.Router();

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

// @route GET /api/v1/leaderboard?matiere=Mathématiques&periode=Ce mois
router.get('/', optionalAuth, reglesListe, getLeaderboard);

// @route GET /api/v1/leaderboard/me
router.get('/me', authenticate, getMyRank);

export default router;
