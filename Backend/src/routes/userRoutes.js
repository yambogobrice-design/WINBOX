import express from 'express';
import { body } from 'express-validator';
import { getMyStats, getMyActivities, updateMyPreferences } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';

const router = express.Router();

// Toutes les routes /users/me concernent l'utilisateur connecté
router.use(authenticate);

// @route GET /api/v1/users/me/stats
router.get('/me/stats', getMyStats);

// @route GET /api/v1/users/me/activities
router.get('/me/activities', getMyActivities);

// @route PATCH /api/v1/users/me/preferences
router.patch(
  '/me/preferences',
  body('preferences').isObject().withMessage('Le champ « preferences » doit être un objet'),
  validate,
  updateMyPreferences
);

export default router;
