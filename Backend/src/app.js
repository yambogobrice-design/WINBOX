import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { dossierUploads } from './middlewares/upload.js';
import routes from './routes/index.js';

dotenv.config();

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

/**
 * Application Express complète, sans écoute réseau ni connexion base de
 * données : `server.js` s'occupe du démarrage, ce qui permet de tester
 * l'application (routes, validation, sécurité) sans MySQL.
 */
const app = express();

// ============================================
// SÉCURITÉ
// ============================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // autorise /uploads depuis le frontend
}));

// CORS : une ou plusieurs origines séparées par des virgules
const origines = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origine) => origine.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origine, callback) => {
    if (!origine || origines.includes(origine)) return callback(null, true);
    return callback(new Error(`Origine non autorisée par CORS : ${origine}`));
  },
  credentials: true
}));

// ============================================
// PARSING ET OPTIMISATION
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// LIMITATION DE DÉBIT
// ============================================

const limiteurGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.' }
});

// Protection renforcée sur les routes sensibles (force brute, spam d'emails)
const limiteurAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives. Réessayez dans quelques minutes.' }
});

app.use(`${API_PREFIX}/`, limiteurGlobal);
app.use(`${API_PREFIX}/auth/login`, limiteurAuth);
app.use(`${API_PREFIX}/auth/register`, limiteurAuth);
app.use(`${API_PREFIX}/auth/forgot-password`, limiteurAuth);
app.use(`${API_PREFIX}/auth/reset-password`, limiteurAuth);

// ============================================
// FICHIERS STATIQUES
// ============================================

// Les fichiers déposés sont accessibles par leur URL (`/uploads/<fichier>`).
// Le téléchargement comptabilisé passe par GET /api/v1/resources/:id/file.
app.use('/uploads', express.static(dossierUploads, { maxAge: '1d' }));

// ============================================
// ROUTES
// ============================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API WinBox opérationnelle',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use(API_PREFIX, routes);

// Racine : présentation de l'API
app.get('/', (req, res) => {
  res.json({
    name: 'API WinBox',
    version: '2.0.0',
    description: 'Backend API pour la plateforme académique WinBox',
    author: 'YAMBOGO BRICE',
    baseUrl: API_PREFIX,
    documentation: 'Voir Backend/API.md',
    domaines: [
      `${API_PREFIX}/auth`,
      `${API_PREFIX}/users`,
      `${API_PREFIX}/resources`,
      `${API_PREFIX}/favorites`,
      `${API_PREFIX}/notifications`,
      `${API_PREFIX}/categories`,
      `${API_PREFIX}/badges`,
      `${API_PREFIX}/admin`
    ]
  });
});

// ============================================
// ERREURS (toujours en dernier)
// ============================================

app.use(notFound);
app.use(errorHandler);

export default app;
