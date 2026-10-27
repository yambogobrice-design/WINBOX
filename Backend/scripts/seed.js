import dotenv from 'dotenv';
import { query, pool, testConnection } from '../src/config/database.js';
import { hashPassword } from '../src/utils/helpers.js';

dotenv.config();

/**
 * Crée (ou met à jour) le compte administrateur avec un mot de passe
 * réellement haché par bcrypt.
 *
 * Usage : npm run seed
 * Personnalisation : ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NOM / ADMIN_PRENOM
 */

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@winbox.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NOM = process.env.ADMIN_NOM || 'WinBox';
const ADMIN_PRENOM = process.env.ADMIN_PRENOM || 'Admin';

const verifierSchema = async () => {
  const tables = await query('SHOW TABLES');
  const noms = tables.map((ligne) => Object.values(ligne)[0]);

  const attendues = ['users', 'categories', 'resources', 'favorites', 'badges', 'activities'];
  const manquantes = attendues.filter((table) => !noms.includes(table));

  if (manquantes.length > 0) {
    console.error(`❌ Schéma incomplet. Tables manquantes : ${manquantes.join(', ')}`);
    console.error('   → Lancez d\'abord : npm run db:init');
    process.exit(1);
  }
};

const creerAdmin = async () => {
  if (!(await testConnection())) {
    console.error('❌ Connexion MySQL impossible. Vérifiez Backend/.env');
    process.exit(1);
  }

  await verifierSchema();

  const password_hash = await hashPassword(ADMIN_PASSWORD);

  await query(
    `INSERT INTO users (nom, prenom, email, password_hash, role, status, is_verified, points)
     VALUES (?, ?, ?, ?, 'admin', 'actif', TRUE, 0)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       role = 'admin',
       status = 'actif',
       is_verified = TRUE`,
    [ADMIN_NOM, ADMIN_PRENOM, ADMIN_EMAIL, password_hash]
  );

  const [admin] = await query(
    'SELECT id, email, role, status FROM users WHERE email = ?',
    [ADMIN_EMAIL]
  );

  const [categories] = await query('SELECT COUNT(*) AS total FROM categories');
  const [badges] = await query('SELECT COUNT(*) AS total FROM badges');

  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║         ✅ BASE DE DONNÉES PRÊTE          ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`👤 Administrateur : ${admin.email} (id ${admin.id}, ${admin.role}, ${admin.status})`);
  console.log(`🔑 Mot de passe   : ${process.env.ADMIN_PASSWORD ? '(défini par ADMIN_PASSWORD)' : ADMIN_PASSWORD}`);
  console.log(`📚 Matières       : ${categories.total}`);
  console.log(`🏅 Badges         : ${badges.total}\n`);

  if (!process.env.ADMIN_PASSWORD) {
    console.log('⚠️  Changez ce mot de passe par défaut avant toute mise en ligne.\n');
  }
};

creerAdmin()
  .catch((error) => {
    console.error('❌ Erreur pendant le seed :', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
