import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Inventaire des routes exposées par l'API, obtenu par analyse statique de
 * `src/routes/index.js` et des routeurs qu'il monte.
 *
 * Partagé par `verifier-code.mjs` (rapport) et `generer-postman.mjs`
 * (collection Postman), afin que la documentation ne dérive pas du code.
 */
const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierRoutes = path.join(racine, 'src', 'routes');

export const racineBackend = racine;

export const inventaireRoutes = () => {
  const cheminIndex = path.join(dossierRoutes, 'index.js');

  if (!fs.existsSync(cheminIndex)) return [];

  const codeIndex = fs.readFileSync(cheminIndex, 'utf8');
  const parModule = new Map();

  // Associe chaque variable importée (par défaut ou nommée) à son fichier
  for (const correspondance of codeIndex.matchAll(/import\s+([^;]*?)\s+from\s+['"]\.\/([A-Za-z0-9_$]+)\.js['"]/g)) {
    const clause = correspondance[1].trim();
    const fichier = correspondance[2];

    const importDefaut = clause.match(/^([A-Za-z0-9_$]+)/);
    if (importDefaut) parModule.set(importDefaut[1], fichier);

    const importNomme = clause.match(/\{([^}]*)\}/);
    if (importNomme) {
      for (const morceau of importNomme[1].split(',')) {
        const nom = morceau.trim().split(/\s+as\s+/).pop()?.trim();
        if (nom) parModule.set(nom, fichier);
      }
    }
  }

  const montages = [...codeIndex.matchAll(/[A-Za-z0-9_$]*[Rr]outer\.use\(\s*['"]([^'"]+)['"]\s*,\s*([A-Za-z0-9_$]+)\s*\)/g)];
  const inventaire = [];

  for (const [, prefixe, variable] of montages) {
    const fichier = parModule.get(variable);
    if (!fichier) continue;

    const chemin = path.join(dossierRoutes, `${fichier}.js`);
    if (!fs.existsSync(chemin)) continue;

    const code = fs.readFileSync(chemin, 'utf8');
    const routes = [...code.matchAll(/[A-Za-z0-9_$]*[Rr]outer\.(get|post|put|patch|delete)\(\s*['"]([^'"]*)['"]/g)];

    for (const [, methode, sousChemin] of routes) {
      inventaire.push({
        domaine: prefixe.replace(/^\//, ''),
        methode: methode.toUpperCase(),
        chemin: `${prefixe}${sousChemin === '/' ? '' : sousChemin}` || '/'
      });
    }
  }

  return inventaire;
};

export default inventaireRoutes;
