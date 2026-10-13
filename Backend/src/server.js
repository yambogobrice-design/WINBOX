import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================

// Sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(`${API_PREFIX}/`, limiter);

// ============================================
// ROUTES
// ============================================

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API WinBox opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/resources`, resourceRoutes);

// Documentation API (route racine)
app.get('/', (req, res) => {
  res.json({
    name: 'API WinBox',
    version: '1.0.0',
    description: 'Backend API pour la plateforme académique WinBox',
    author: 'YAMBOGO BRICE',
    endpoints: {
      health: '/health',
      auth: {
        register: `POST ${API_PREFIX}/auth/register`,
        login: `POST ${API_PREFIX}/auth/login`,
        profile: `GET ${API_PREFIX}/auth/me`,
      },
      resources: {
        list: `GET ${API_PREFIX}/resources`,
        get: `GET ${API_PREFIX}/resources/:id`,
        create: `POST ${API_PREFIX}/resources`,
        update: `PUT ${API_PREFIX}/resources/:id`,
        delete: `DELETE ${API_PREFIX}/resources/:id`,
      }
    },
    documentation: 'https://github.com/winbox/api-docs'
  });
});

// ============================================
// GESTION DES ERREURS
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Impossible de démarrer le serveur sans connexion à la base de données');
      process.exit(1);
    }

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log('\n╔═══════════════════════════════════════════╗');
      console.log('║        🚀 SERVEUR WINBOX DÉMARRÉ 🚀       ║');
      console.log('╚═══════════════════════════════════════════╝');
      console.log(`📡 Serveur: http://localhost:${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}${API_PREFIX}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Démarré le: ${new Date().toLocaleString()}\n`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();
