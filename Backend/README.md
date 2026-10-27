# 🚀 Backend API WinBox

Backend Node.js + Express + MySQL pour la plateforme académique WinBox.

> 📖 Référence complète des endpoints, conventions et correspondance avec les
> pages du frontend : **[API.md](./API.md)**

## 📋 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0 (ou MariaDB 10.4+)

## 🛠️ Installation

### 1. Dépendances

```bash
cd Backend
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example .env
```

Puis renseignez au minimum `DB_PASSWORD` et `JWT_SECRET` :

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=winbox_db

JWT_SECRET=generer_une_cle_securisee_ici
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Générer une clé JWT :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Base de données

```bash
npm run db:init   # crée la base, les 19 tables, les vues et les données de référence
npm run seed      # crée le compte administrateur (mot de passe haché par bcrypt)
```

`db:init` est idempotent : le script SQL peut être rejoué sans erreur.
Le compte par défaut est `admin@winbox.com` / `Admin@123` — **à changer**
(`ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env`), ainsi qu'après la première connexion.

## 🚀 Démarrage

```bash
npm run dev     # développement, rechargement automatique (nodemon)
npm start       # production
```

Le serveur écoute sur `http://localhost:5000` :

- `GET /health` — état du service
- `GET /api/v1` — liste des domaines exposés
- `/uploads/<fichier>` — fichiers déposés

## 📜 Scripts

| Script | Rôle |
|---|---|
| `npm start` | Démarre le serveur |
| `npm run dev` | Démarre avec nodemon |
| `npm run db:init` | Applique `src/config/database.sql` |
| `npm run seed` | Crée/actualise le compte administrateur |
| `npm run verify` | Vérifications statiques (sans base ni dépendances) |
| `npm test` | Identique à `npm run verify` |

`npm run verify` contrôle la syntaxe de chaque fichier, la résolution des imports
et l'existence des exportations, la cohérence des tables/colonnes citées avec le
schéma SQL, et affiche l'inventaire des routes exposées.

## 🗂️ Architecture

```
Backend/
├── API.md                    référence de l'API
├── scripts/
│   ├── init-db.js            application du schéma SQL
│   ├── seed.js               compte administrateur
│   ├── verifier-code.mjs     vérifications statiques
│   └── generer-postman.mjs   régénère la collection Postman
├── src/
│   ├── app.js                application Express (sans écoute réseau)
│   ├── server.js             démarrage + arrêt gracieux
│   ├── config/
│   │   ├── database.js       pool MySQL
│   │   └── database.sql      schéma complet (v2)
│   ├── controllers/          auth, users, resources, favorites, catalogue,
│   │                         notifications, admin
│   ├── middlewares/          auth (rôles), validation, erreurs, upload,
│   │                         normalisation des champs français
│   ├── routes/               un routeur par domaine + index.js
│   └── utils/                helpers, ApiError, catégories, gamification,
│                             notifications
└── uploads/                  fichiers déposés
```

`app.js` est séparé de `server.js` pour permettre de tester l'application
(routes, validation, sécurité) sans connexion MySQL.

## 📡 Domaines de l'API

| Domaine | Préfixe | Contenu |
|---|---|---|
| Authentification | `/api/v1/auth` | inscription, connexion, profil, mot de passe oublié |
| Utilisateur | `/api/v1/users` | statistiques, activité, préférences |
| Ressources | `/api/v1/resources` | livres, cours, sujets, corrections, supports |
| Favoris | `/api/v1/favorites` | liste, ajout, retrait |
| Catalogue | `/api/v1/categories`, `/api/v1/badges` | matières et badges |
| Notifications | `/api/v1/notifications` | lecture, marquage |
| Administration | `/api/v1/admin` | tableau de bord, utilisateurs, modération |

44 routes au total — détail dans [API.md](./API.md).

## 🗄️ Base de données

**15 tables** : `users`, `password_resets`, `categories`, `resources`, `favorites`,
`ratings`, `downloads`, `comments`, `notifications`, `activities`, `badges`,
`user_badges`, `quiz`, `quiz_questions`, `quiz_attempts` — plus 1 vue
(`v_ressources_publiques`).

Relations principales :

```
users (1) ─────< (N) resources          categories (1) ─< (N) resources
users (1) ─────< (N) favorites          resources  (1) ─< (N) downloads
users (1) ─────< (N) activities         resources  (1) ─< (N) favorites
users (1) ─────< (N) user_badges        resources  (1) ─< (N) ratings
users (1) ─────< (N) quiz_attempts      quiz       (1) ─< (N) quiz_questions
```

Points de gamification (`src/utils/gamification.js`) : inscription +20,
téléchargement +1, quiz +10, contribution soumise +5, contribution validée +50.
Les badges sont attribués automatiquement dès que leur condition est remplie.

## 🔒 Sécurité

- **Helmet** : en-têtes HTTP de protection
- **JWT** : authentification par jeton, rôles `etudiant` / `contributeur` / `admin`
- **bcrypt** : hachage des mots de passe (10 tours)
- **Limitation de débit** : 500 requêtes / 15 min, 20 sur les routes
  d'authentification (force brute, spam d'emails)
- **Validation** : `express-validator` sur les entrées + identifiants d'URL
- **Uploads** : extensions autorisées, taille limitée, nom de fichier neutralisé
- **Requêtes SQL** : requêtes préparées uniquement, `ORDER BY` en liste blanche
- **Modération** : un dépôt utilisateur n'est publié qu'après validation admin

## 🎯 Fonctionnalités

✅ Authentification JWT + rôles
✅ Inscription, connexion, mot de passe oublié/réinitialisation
✅ Profil complet (statistiques, activité, préférences, badges)
✅ CRUD ressources + upload de fichiers + compteur de téléchargements
✅ Modération (validation / refus motivé) et notifications à l'auteur
✅ Favoris
✅ Recherche et filtres avancés + pagination
✅ Catalogue des matières et des badges
✅ Tableau de bord et gestion des utilisateurs pour l'administration
✅ Gamification (points, badges, fil d'activité)

## 📊 Performance

- Pool de connexions MySQL (`connectionLimit: 10`)
- Index sur les colonnes filtrées et triées, index FULLTEXT sur les ressources
- Compression gzip des réponses
- Vues SQL pour les listes fréquentes

## 🔄 Workflows

### Ajouter un endpoint

1. Contrôleur dans `src/controllers/` (utiliser `asyncHandler` + `ApiError`)
2. Route dans `src/routes/` (règles `express-validator` + `validate`)
3. Si nouveau domaine : le monter dans `src/routes/index.js`
4. `npm run verify` puis tester avec Postman

### Ajouter une table

1. Modifier `src/config/database.sql` (idempotent : `CREATE TABLE IF NOT EXISTS`)
2. `npm run db:init`
3. `npm run verify` — le script signale toute table ou colonne citée mais absente

## 📄 Licence

ISC

## 👤 Auteur

**YAMBOGO BRICE**
- Email : yambogobrice@gmail.com
- LinkedIn : [YAMBOGO BRICE](https://www.linkedin.com/in/yambogo-brice/)
- GitHub : [@yambogobrice-design](https://github.com/yambogobrice-design)

---

**Version :** 2.0.0
