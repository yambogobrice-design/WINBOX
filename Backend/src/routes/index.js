import express from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import badgeRoutes from './badgeRoutes.js';

/**
 * Point de montage unique de l'API.
 * Chaque domaine expose ses routes sous son préfixe.
 */
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resources', resourceRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/badges', badgeRoutes);
router.use('/admin', adminRoutes);

// Inventaire des domaines exposés (utile pour /api/v1)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API WinBox v2',
    domains: {
      auth: '/auth',
      users: '/users',
      resources: '/resources',
      favorites: '/favorites',
      notifications: '/notifications',
      categories: '/categories',
      badges: '/badges',
      admin: '/admin'
    }
  });
});

export default router;
