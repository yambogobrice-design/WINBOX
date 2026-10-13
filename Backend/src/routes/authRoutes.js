import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { normaliserChamps } from '../middlewares/normalisation.js';

const router = express.Router();

// Le frontend envoie « motDePasse » : normaliserChamps le traduit en « password »
router.use(normaliserChamps);

const reglesInscription = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('telephone').optional({ values: 'falsy' }).isLength({ max: 20 }).withMessage('Téléphone trop long'),
  validate
];

const reglesConnexion = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  validate
];

const reglesMotDePasseOublie = [
  body('email').isEmail().withMessage('Email invalide'),
  validate
];

const reglesReinitialisation = [
  body('token').notEmpty().withMessage('Le jeton est requis'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  validate
];

const reglesChangementMotDePasse = [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères'),
  validate
];

// --- Routes publiques ---
router.post('/register', reglesInscription, register);
router.post('/login', reglesConnexion, login);
router.post('/forgot-password', reglesMotDePasseOublie, forgotPassword);
router.post('/reset-password', reglesReinitialisation, resetPassword);

// --- Routes protégées ---
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.patch('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, reglesChangementMotDePasse, changePassword);
router.post('/logout', authenticate, logout);

export default router;
