import express from 'express';
import { query } from 'express-validator';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, idValide } from '../middlewares/validation.js';

const router = express.Router();

router.use(authenticate);

const reglesListe = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate
];

router.get('/', reglesListe, getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', idValide, markAsRead);
router.delete('/:id', idValide, deleteNotification);

export default router;
