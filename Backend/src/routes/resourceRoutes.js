import express from 'express';
import { body, query } from 'express-validator';
import {
  getResources,
  getMyResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  telechargerFichier
} from '../controllers/resourceController.js';
import { addFavorite } from '../controllers/favoriteController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { validate, idValide } from '../middlewares/validation.js';
import { uploadRessource } from '../middlewares/upload.js';

const router = express.Router();

const TYPES = ['livre', 'cours', 'sujet', 'correction', 'support'];

const reglesCreation = [
  body('titre').trim().isLength({ min: 3 }).withMessage('Le titre est requis (3 caractères minimum)'),
  body('type').isIn(TYPES).withMessage(`Type invalide. Valeurs acceptées : ${TYPES.join(', ')}`),
  body('description').optional({ values: 'falsy' }).isLength({ max: 5000 }),
  validate
];

const reglesMiseAJour = [
  body('titre').optional().trim().isLength({ min: 3 }).withMessage('Le titre doit contenir au moins 3 caractères'),
  body('type').optional().isIn(TYPES).withMessage(`Type invalide. Valeurs acceptées : ${TYPES.join(', ')}`),
  validate
];

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

// --- Routes publiques (auth optionnelle : renseigne is_favorite) ---
router.get('/', optionalAuth, reglesListe, getResources);
router.get('/mine', authenticate, reglesListe, getMyResources);
router.get('/:id', optionalAuth, idValide, getResourceById);

// --- Routes protégées ---
router.post('/', authenticate, uploadRessource, reglesCreation, createResource);
router.put('/:id', authenticate, idValide, reglesMiseAJour, updateResource);
router.patch('/:id', authenticate, idValide, reglesMiseAJour, updateResource);
router.delete('/:id', authenticate, idValide, deleteResource);

// Téléchargement : enregistrement (JSON) ou envoi direct du fichier
router.post('/:id/download', authenticate, idValide, downloadResource);
router.get('/:id/file', authenticate, idValide, telechargerFichier);

// Raccourci favori depuis une ressource
router.post('/:id/favorite', authenticate, idValide, addFavorite);

export default router;
