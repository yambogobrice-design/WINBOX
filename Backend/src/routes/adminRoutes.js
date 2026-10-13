import express from 'express';
import { body, query } from 'express-validator';
import { getDashboardStats, getRecentActivity, getPendingActions } from '../controllers/adminController.js';
import { listUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { getResourcesAdmin, modererRessource } from '../controllers/resourceController.js';
import { authenticate, estAdmin } from '../middlewares/auth.js';
import { validate, idValide } from '../middlewares/validation.js';

const router = express.Router();

// Tout l'espace d'administration exige un compte « admin »
router.use(authenticate, estAdmin);

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

// --- Tableau de bord ---
router.get('/stats', getDashboardStats);
router.get('/activity', reglesListe, getRecentActivity);
router.get('/pending', reglesListe, getPendingActions);

// --- Utilisateurs ---
router.get('/users', reglesListe, listUsers);
router.get('/users/:id', idValide, getUserById);
router.patch(
  '/users/:id',
  idValide,
  body('role').optional().isIn(['etudiant', 'contributeur', 'admin']).withMessage('Rôle invalide'),
  body('status').optional().isIn(['actif', 'inactif', 'suspendu']).withMessage('Statut invalide'),
  body('points').optional().isInt({ min: 0 }).withMessage('Points invalides'),
  body('is_verified').optional().isBoolean().withMessage('is_verified doit être un booléen'),
  validate,
  updateUser
);
router.delete('/users/:id', idValide, deleteUser);

// --- Ressources / modération ---
router.get('/resources', reglesListe, getResourcesAdmin);
router.patch(
  '/resources/:id/status',
  idValide,
  body('status').isIn(['en_attente', 'validee', 'refusee']).withMessage('Statut invalide'),
  body('comment').optional({ values: 'falsy' }).isLength({ max: 1000 }),
  validate,
  modererRessource
);

export default router;
