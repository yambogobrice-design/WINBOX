import express from 'express';
import { getCategories, getCategorie } from '../controllers/catalogueController.js';

const router = express.Router();

// @route GET /api/v1/categories — matières disponibles (avec compteur de ressources)
router.get('/', getCategories);

// @route GET /api/v1/categories/:slug — détail d'une matière
router.get('/:slug', getCategorie);

export default router;
