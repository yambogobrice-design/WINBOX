import dotenv from 'dotenv';
import app from './app.js';
import { testConnection, pool } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const startServer = async () => {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('❌ Impossible de démarrer le serveur sans connexion à la base de données');
    console.error('   → Vérifiez le fichier .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
    console.error('   → Initialisez le schéma : npm run db:init && npm run seed');
    process.exit(1);
  }

  const serveur = app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║        🚀 SERVEUR WINBOX DÉMARRÉ 🚀       ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log(`📡 Serveur   : http://localhost:${PORT}`);
    console.log(`🔌 API       : http://localhost:${PORT}${API_PREFIX}`);
    console.log(`❤️  Santé     : http://localhost:${PORT}/health`);
    console.log(`📁 Uploads   : http://localhost:${PORT}/uploads`);
    console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Démarré le : ${new Date().toLocaleString()}\n`);
  });

  // Arrêt gracieux : on ferme le serveur HTTP puis le pool MySQL
  const arreter = (signal) => {
    console.log(`\n🛑 ${signal} reçu. Arrêt gracieux du serveur...`);

    serveur.close(async () => {
      try {
        await pool.end();
        console.log('✅ Connexions fermées. À bientôt !');
        process.exit(0);
      } catch (error) {
        console.error('Erreur lors de la fermeture du pool MySQL:', error.message);
        process.exit(1);
      }
    });

    // Sécurité : arrêt forcé si des connexions traînent
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => arreter('SIGTERM'));
  process.on('SIGINT', () => arreter('SIGINT'));
};

process.on('unhandledRejection', (raison) => {
  console.error('❌ Promesse non gérée:', raison);
});

startServer();
