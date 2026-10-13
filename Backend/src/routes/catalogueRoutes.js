import express from 'express';
import { getCategories, getCategorie, getBadges, getMyBadges } from '../controllers/catalogueController.js';
import { authenticate } from '../middlewares/auth.js';

// --- Matières ---
export const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/:slug', getCategorie);

// --- Badges ---
export const badgeRouter = express.Router();

badgeRouter.get('/', getBadges);
badgeRouter.get('/me', authenticate, getMyBadges);

export const categoryRoutes = categoryRouter;
export const badgeRoutes = badgeRouter;

export default { categoryRoutes, badgeRoutes };
