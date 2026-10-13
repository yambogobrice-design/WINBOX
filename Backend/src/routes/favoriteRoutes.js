import express from 'express';
import { addFavorite, getFavorites, removeFavorite, clearFavorites } from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, idValide } from '../middlewares/validation.js';
import { query } from 'express-validator';

const router = express.Router();

router.use(authenticate);

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

// @route GET /api/v1/favorites
router.get('/', reglesListe, getFavorites);

// @route POST /api/v1/favorites  { resource_id }
// @route POST /api/v1/favorites/:id
router.post('/', addFavorite);
router.post('/:id', idValide, addFavorite);

// @route DELETE /api/v1/favorites  — vider la liste
router.delete('/', clearFavorites);

// @route DELETE /api/v1/favorites/:id
router.delete('/:id', idValide, removeFavorite);

export default router;
