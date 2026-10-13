import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialise la base de données à partir de src/config/database.sql.
 * Le script est idempotent : il peut être rejoué sans erreur.
 *
 * Usage : npm run db:init
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cheminSql = path.resolve(__dirname, '../src/config/database.sql');

const executer = async () => {
  if (!fs.existsSync(cheminSql)) {
    console.error(`❌ Fichier SQL introuvable : ${cheminSql}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(cheminSql, 'utf8');

  let connexion;

  try {
    // Connexion sans base de données : le script commence par CREATE DATABASE
    connexion = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
  } catch (error) {
    console.error('❌ Connexion MySQL impossible :', error.message);
    console.error('   → Vérifiez DB_HOST, DB_PORT, DB_USER et DB_PASSWORD dans Backend/.env');
    process.exit(1);
  }

  try {
    console.log(`⏳ Exécution de ${path.relative(process.cwd(), cheminSql)}...`);

    const resultats = await connexion.query(sql);
    const liste = Array.isArray(resultats[0]) ? resultats[0] : resultats;

    // Dernier SELECT du script : message de confirmation
    const dernier = Array.isArray(liste) ? liste[liste.length - 1] : null;
    if (Array.isArray(dernier) && dernier[0]?.message) {
      console.log(`✅ ${dernier[0].message}`);
    } else {
      console.log('✅ Schéma appliqué.');
    }

    console.log('   → Créez le compte administrateur : npm run seed');
  } catch (error) {
    console.error('❌ Erreur pendant l\'exécution du script SQL :', error.message);
    process.exitCode = 1;
  } finally {
    await connexion.end();
  }
};

executer();
