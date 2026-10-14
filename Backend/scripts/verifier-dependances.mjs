#!/usr/bin/env node
/**
 * Garde-fou exécuté avant `npm start` et `npm run dev` (hooks prestart / predev).
 *
 * Sans dépendances installées, Node échoue sur un laconique
 * « Cannot find module 'express' ». Ce script explique quoi faire.
 *
 * Usage direct : npm run check:deps
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierModules = path.join(racine, 'node_modules');

// Paquets indispensables au démarrage du serveur
const REQUIS = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'compression',
  'express-rate-limit',
  'express-validator',
  'dotenv',
  'mysql2',
  'bcryptjs',
  'jsonwebtoken',
  'multer'
];

const manquants = REQUIS.filter((paquet) => !fs.existsSync(path.join(dossierModules, paquet)));

if (manquants.length === 0) {
  process.exit(0);
}

console.error('\n❌ Dépendances manquantes : impossible de démarrer le serveur.\n');
console.error(`   node_modules ${fs.existsSync(dossierModules) ? 'est incomplet' : 'est absent'} — paquets manquants : ${manquants.join(', ')}\n`);
console.error('   → Installez les dépendances :\n');
console.error('       cd "' + racine + '"');
console.error('       npm install\n');
console.error('   → Puis démarrez le serveur :\n');
console.error('       npm run dev      (rechargement automatique)');
console.error('       npm start        (production)\n');
console.error('   ℹ️  La base de données doit être prête : npm run db:init && npm run seed');
console.error('   ℹ️  La configuration se fait dans Backend/.env (copier .env.example)\n');

process.exit(1);
