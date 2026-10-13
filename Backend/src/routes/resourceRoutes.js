import express from 'express';
import { 
  getResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource,
  downloadResource
} from '../controllers/resourceController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Routes publiques (avec auth optionnelle)
router.get('/', optionalAuth, getResources);
router.get('/:id', optionalAuth, getResourceById);

// Routes protégées
router.post('/', authenticate, createResource);
router.put('/:id', authenticate, updateResource);
router.delete('/:id', authenticate, deleteResource);
router.post('/:id/download', authenticate, downloadResource);

export default router;
