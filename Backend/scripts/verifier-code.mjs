#!/usr/bin/env node
/**
 * Vérifications statiques du backend — aucune dépendance, aucune base requise.
 *
 *   1. Syntaxe de chaque fichier JavaScript (node --check)
 *   2. Résolution des imports relatifs + existence des exportations nommées
 *   3. Inventaire des routes exposées par l'API
 *   4. Cohérence des tables et colonnes SQL citées avec src/config/database.sql
 *
 * Usage : npm run verify
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { inventaireRoutes } from './inventaire-routes.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierSrc = path.join(racine, 'src');
const cheminSql = path.join(dossierSrc, 'config', 'database.sql');

const erreurs = [];
const avertissements = [];

// ============================================
// OUTILS
// ============================================

const listerFichiers = (dossier, extensions = ['.js']) => {
  const resultats = [];

  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const chemin = path.join(dossier, entree.name);

    if (entree.isDirectory()) {
      if (entree.name === 'node_modules') continue;
      resultats.push(...listerFichiers(chemin, extensions));
    } else if (extensions.includes(path.extname(entree.name))) {
      resultats.push(chemin);
    }
  }

  return resultats;
};

const relatif = (chemin) => path.relative(racine, chemin).replace(/\\/g, '/');

// ============================================
// 1. SYNTAXE
// ============================================
const verifierSyntaxe = (fichiers) => {
  const fautifs = [];

  for (const fichier of fichiers) {
    const resultat = spawnSync(process.execPath, ['--check', fichier], { stdio: 'ignore' });

    if (resultat.status !== 0) {
      fautifs.push(fichier);
      erreurs.push(`Syntaxe invalide : ${relatif(fichier)}`);
    }
  }

  return fautifs;
};

// ============================================
// 2. IMPORTS / EXPORTS
// ============================================

// Noms exportés par un module (export const/function/class, export { … })
const nomsExportes = (code) => {
  const noms = new Set();

  const motifs = [
    /export\s+(?:async\s+)?(?:const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g,
    /export\s*\{([^}]*)\}/g
  ];

  for (const motif of motifs) {
    for (const correspondance of code.matchAll(motif)) {
      if (motif.source.includes('\\{')) {
        for (const morceau of correspondance[1].split(',')) {
          const nom = morceau.trim().split(/\s+as\s+/).pop()?.trim();
          if (nom && /^[A-Za-z0-9_$]+$/.test(nom)) noms.add(nom);
        }
      } else {
        noms.add(correspondance[1]);
      }
    }
  }

  return noms;
};

const verifierImports = (fichiers) => {
  // La clause ne doit pas traverser un « ; » : sinon un import de paquet
  // (import express from 'express') absorberait l'import local suivant.
  const motifImport = /import\s+([^;]*?)\s+from\s+['"]([^'"]+)['"]/g;

  for (const fichier of fichiers) {
    const code = fs.readFileSync(fichier, 'utf8');
    const dossier = path.dirname(fichier);

    for (const correspondance of code.matchAll(motifImport)) {
      const clause = correspondance[1].trim();
      const source = correspondance[2];

      // Seuls les modules locaux sont vérifiables
      if (!source.startsWith('.')) continue;

      let cible = path.resolve(dossier, source);
      if (!path.extname(cible)) cible += '.js';

      if (!fs.existsSync(cible)) {
        erreurs.push(`Import introuvable : ${source} (dans ${relatif(fichier)})`);
        continue;
      }

      const importesNommes = clause.match(/\{([^}]*)\}/);
      if (!importesNommes) continue;

      const exports = nomsExportes(fs.readFileSync(cible, 'utf8'));

      for (const morceau of importesNommes[1].split(',')) {
        const nom = morceau.trim().split(/\s+as\s+/)[0].trim();
        if (!nom) continue;

        if (!exports.has(nom)) {
          erreurs.push(`Export « ${nom} » absent de ${relatif(cible)} (importé par ${relatif(fichier)})`);
        }
      }
    }
  }
};

// ============================================
// 3. INVENTAIRE DES ROUTES
// ============================================
// La logique est partagée avec le générateur de collection Postman afin que la
// documentation et le code ne puissent pas diverger.
// (voir scripts/inventaire-routes.mjs)

// ============================================
// 4. COHÉRENCE SQL
// ============================================
const analyserSchema = () => {
  const sql = fs.readFileSync(cheminSql, 'utf8');
  const tables = new Map();

  const motifTable = /CREATE TABLE IF NOT EXISTS\s+([a-z_]+)\s*\(([\s\S]*?)\)\s*ENGINE/gi;

  for (const correspondance of sql.matchAll(motifTable)) {
    const nom = correspondance[1];
    const corps = correspondance[2];
    const colonnes = new Set();

    for (const ligne of corps.split('\n')) {
      const definition = ligne.trim();
      const correspondanceColonne = definition.match(/^([a-z_]+)\s+(?:INT|VARCHAR|TEXT|BOOLEAN|TIMESTAMP|DATE|DATETIME|DECIMAL|ENUM|JSON|BIGINT|TINYINT)/i);
      if (correspondanceColonne) colonnes.add(correspondanceColonne[1]);
    }

    tables.set(nom, colonnes);
  }

  const vues = new Set(
    [...sql.matchAll(/CREATE OR REPLACE VIEW\s+([a-z_]+)/gi)].map((correspondance) => correspondance[1])
  );

  return { tables, vues };
};

const verifierSql = (fichiers, schema) => {
  const tablesCitees = new Set();
  const colonnesInserees = [];

  for (const fichier of fichiers) {
    const code = fs.readFileSync(fichier, 'utf8');

    // Tables réellement ciblées par une requête (hors sous-requêtes dérivées
    // et hors clause « ON DUPLICATE KEY UPDATE »)
    const motifTable = /(?<!KEY\s)\b(?:FROM|JOIN|INTO|UPDATE)\s+([a-z_]{3,})\b/g;
    for (const correspondance of code.matchAll(motifTable)) {
      tablesCitees.add(correspondance[1]);
    }

    // Colonnes des INSERT : elles doivent exister dans le schéma
    const motifInsert = /INSERT\s+(?:IGNORE\s+)?INTO\s+([a-z_]+)\s*\(([^)]+)\)/gi;
    for (const correspondance of code.matchAll(motifInsert)) {
      colonnesInserees.push({
        table: correspondance[1],
        colonnes: correspondance[2].split(',').map((colonne) => colonne.trim()).filter(Boolean),
        fichier
      });
    }
  }

  const motsCles = new Set(['select', 'dual', 'values', 'set', 'table', 'where']);
  const connues = new Set([...schema.tables.keys(), ...schema.vues]);

  for (const table of tablesCitees) {
    if (motsCles.has(table)) continue;
    if (!connues.has(table)) {
      erreurs.push(`Table SQL inconnue : « ${table} » (absente de database.sql)`);
    }
  }

  for (const { table, colonnes, fichier } of colonnesInserees) {
    const attendues = schema.tables.get(table);
    if (!attendues) continue;

    for (const colonne of colonnes) {
      if (!attendues.has(colonne)) {
        erreurs.push(`Colonne inconnue : ${table}.${colonne} (INSERT dans ${relatif(fichier)})`);
      }
    }
  }

  return { tablesCitees, colonnesInserees };
};

// ============================================
// EXÉCUTION
// ============================================
const fichiers = listerFichiers(dossierSrc);
const fautifs = verifierSyntaxe(fichiers);

// Les fichiers en erreur de syntaxe fausseraient les analyses suivantes
const fichiersSains = fichiers.filter((fichier) => !fautifs.includes(fichier));

verifierImports(fichiersSains);

const schema = analyserSchema();
verifierSql(fichiersSains, schema);

const inventaire = inventaireRoutes();

if (inventaire.length === 0) {
  avertissements.push('Aucune route détectée : vérifiez src/routes/index.js');
}

// ============================================
// RAPPORT
// ============================================
console.log('\n📋 Inventaire des routes\n');

const parPrefixe = inventaire.reduce((acc, route) => {
  const prefixe = route.chemin.split('/')[1] || 'racine';
  (acc[prefixe] ||= []).push(route);
  return acc;
}, {});

for (const [prefixe, routes] of Object.entries(parPrefixe)) {
  console.log(`  /${prefixe}`);
  for (const route of routes) {
    console.log(`    ${route.methode.padEnd(6)} ${route.chemin}`);
  }
}

console.log(`\n  Total : ${inventaire.length} routes`);
console.log(`  Fichiers analysés : ${fichiers.length}`);
console.log(`  Tables du schéma : ${schema.tables.size} (+${schema.vues.size} vues)`);

if (avertissements.length > 0) {
  console.log('\n⚠️  Avertissements');
  for (const avertissement of avertissements) console.log(`   - ${avertissement}`);
}

if (erreurs.length > 0) {
  console.log('\n❌ Erreurs détectées');
  for (const erreur of erreurs) console.log(`   - ${erreur}`);
  console.log('');
  process.exit(1);
}

console.log('\n✅ Aucune erreur détectée.\n');
