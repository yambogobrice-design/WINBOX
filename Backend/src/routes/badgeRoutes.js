import express from 'express';
import { getBadges, getMyBadges } from '../controllers/catalogueController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// @route GET /api/v1/badges — catalogue public
router.get('/', getBadges);

// @route GET /api/v1/badges/me — badges obtenus par l'utilisateur connecté
router.get('/me', authenticate, getMyBadges);

export default router;
