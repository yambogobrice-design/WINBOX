import fs from 'node:fs';
import path from 'node:path';
import { inventaireRoutes, racineBackend } from './inventaire-routes.mjs';

/**
 * Régénère `WinBox.postman_collection.json` à partir de l'inventaire des routes.
 * La collection reste ainsi synchronisée avec le code.
 *
 * Usage : npm run postman
 */

// Routes accessibles sans jeton
const ROUTES_PUBLIQUES = new Set([
  'POST /auth/register',
  'POST /auth/login',
  'POST /auth/forgot-password',
  'POST /auth/reset-password',
  'GET /resources',
  'GET /resources/:id',
  'GET /categories',
  'GET /categories/:slug',
  'GET /badges'
]);

// Corps d'exemple pour les requêtes porteuses de données
const CORPS_EXEMPLE = {
  'POST /auth/register': {
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com',
    motDePasse: 'motdepasse123',
    telephone: '+226 70000000',
    niveau: 'Licence 2',
    filiere: 'Informatique',
    institution: 'Université de Ouagadougou'
  },
  'POST /auth/login': { email: 'admin@winbox.com', motDePasse: 'Admin@123' },
  'POST /auth/forgot-password': { email: 'john.doe@example.com' },
  'POST /auth/reset-password': { token: 'jeton-recu-par-email', motDePasse: 'nouveauMotDePasse123' },
  'PUT /auth/profile': { nom: 'Doe', prenom: 'John', niveau: 'Licence 3', specialite: 'Génie logiciel' },
  'PUT /auth/change-password': { ancienMotDePasse: 'motdepasse123', nouveauMotDePasse: 'motdepasse456' },
  'PATCH /users/me/preferences': {
    preferences: { notifications_email: true, profil_public: true, participer_classement: true }
  },
  'POST /resources': {
    titre: 'Cours de Mathématiques - Analyse',
    type: 'cours',
    description: 'Cours complet sur l\'analyse mathématique',
    auteur: 'Prof. Dupont',
    matiere: 'mathematiques',
    niveau: 'Licence 2',
    filiere: 'Informatique',
    annee_academique: '2026-2027',
    tags: ['analyse', 'intégration']
  },
  'PUT /resources/:id': { titre: 'Titre corrigé', description: 'Description mise à jour' },
  'POST /favorites': { resource_id: 1 },
  'PATCH /admin/resources/:id/status': { status: 'validee', comment: 'Contenu conforme' },
  'PATCH /admin/users/:id': { role: 'contributeur', status: 'actif' }
};

const libellesParametres = {
  id: 'identifiant',
  slug: 'matiere-slug'
};

// Convertit « /resources/:id/download » en segments Postman
const construireUrl = (chemin) => {
  const segments = chemin.split('/').filter(Boolean).map((segment) => {
    if (!segment.startsWith(':')) return segment;

    const nom = segment.slice(1);
    return `:${libellesParametres[nom] || nom}`;
  });

  return {
    raw: `{{baseUrl}}/${chemin.replace(/^\//, '').replace(/:([A-Za-z]+)/g, '{{$1}}')}`,
    host: ['{{baseUrl}}'],
    path: segments
  };
};

const construireRequete = (route) => {
  const cle = `${route.methode} ${route.chemin}`;
  const estPublique = ROUTES_PUBLIQUES.has(cle);
  const corps = CORPS_EXEMPLE[cle];

  const requete = {
    name: `${route.methode} ${route.chemin}`,
    request: {
      method: route.methode,
      header: [],
      url: construireUrl(route.chemin),
      description: estPublique ? 'Accès public' : 'Jeton requis (Bearer)'
    },
    response: []
  };

  if (!estPublique) {
    requete.request.auth = { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] };
  }

  if (corps) {
    requete.request.header.push({ key: 'Content-Type', value: 'application/json' });
    requete.request.body = { mode: 'raw', raw: JSON.stringify(corps, null, 2) };
  }

  if (route.methode === 'POST' && route.chemin === '/resources') {
    requete.request.description = 'multipart/form-data : champ « fichier » + champs texte';
  }

  return requete;
};

const construireCollection = () => {
  const routes = inventaireRoutes();

  const domaines = routes.reduce((acc, route) => {
    (acc[route.domaine] ||= []).push(route);
    return acc;
  }, {});

  return {
    info: {
      name: 'WinBox API',
      description: 'Collection générée depuis l\'inventaire des routes (npm run postman).',
      version: '2.0.0',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: 'http://localhost:5000/api/v1', type: 'string' },
      { key: 'token', value: '', type: 'string' }
    ],
    item: Object.entries(domaines).map(([domaine, liste]) => ({
      name: domaine,
      item: liste.map(construireRequete)
    }))
  };
};

const collection = construireCollection();
const destination = path.join(racineBackend, 'WinBox.postman_collection.json');

fs.writeFileSync(destination, JSON.stringify(collection, null, 2));

const total = collection.item.reduce((somme, dossier) => somme + dossier.item.length, 0);

console.log(`✅ Collection Postman régénérée : ${path.relative(process.cwd(), destination)}`);
console.log(`   ${collection.item.length} dossiers, ${total} requêtes\n`);
