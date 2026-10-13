# 🚀 Backend API WinBox

Backend Node.js + Express + MySQL pour la plateforme académique WinBox.

## 📋 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0
- **Git**

## 🛠️ Installation

### 1. Cloner le projet
```bash
cd Backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données

#### Créer la base de données MySQL
```bash
mysql -u root -p
```

Ensuite exécuter le script SQL :
```sql
source src/config/database.sql
```

Ou via la ligne de commande :
```bash
mysql -u root -p < src/config/database.sql
```

### 4. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Puis éditer `.env` avec vos paramètres :
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
```

## 🚀 Démarrage

### Mode développement (avec hot reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## 📡 Endpoints API

### Base URL
```
http://localhost:5000/api/v1
```

### 🔐 Authentification

#### Inscription
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nom": "Doe",
  "prenom": "John",
  "email": "john@example.com",
  "password": "motdepasse123",
  "telephone": "+226 70591159",
  "niveau": "Licence 2",
  "filiere": "Informatique",
  "institution": "Université de Ouagadougou"
}
```

#### Connexion
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Profil utilisateur
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

### 📚 Ressources

#### Lister les ressources
```http
GET /api/v1/resources?page=1&limit=20&type=livre&search=mathématiques
```

**Paramètres de requête:**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre de résultats par page (défaut: 20)
- `type` : Type de ressource (livre, cours, sujet, correction, support)
- `category_id` : ID de la catégorie
- `niveau` : Niveau académique
- `filiere` : Filière
- `search` : Recherche textuelle

#### Obtenir une ressource
```http
GET /api/v1/resources/:id
```

#### Créer une ressource
```http
POST /api/v1/resources
Authorization: Bearer {token}
Content-Type: application/json

{
  "titre": "Cours de Mathématiques - Analyse",
  "description": "Cours complet sur l'analyse mathématique",
  "type": "cours",
  "category_id": 1,
  "niveau": "Licence 2",
  "filiere": "Mathématiques",
  "annee_academique": "2026-2027",
  "tags": ["analyse", "mathématiques", "intégration"]
}
```

#### Mettre à jour une ressource
```http
PUT /api/v1/resources/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "titre": "Nouveau titre",
  "description": "Nouvelle description"
}
```

#### Supprimer une ressource
```http
DELETE /api/v1/resources/:id
Authorization: Bearer {token}
```

#### Télécharger une ressource
```http
POST /api/v1/resources/:id/download
Authorization: Bearer {token}
```

## 🗄️ Structure de la base de données

### Tables principales

- **users** : Utilisateurs de la plateforme
- **categories** : Catégories de ressources
- **resources** : Ressources académiques
- **favorites** : Favoris des utilisateurs
- **ratings** : Évaluations des ressources
- **downloads** : Historique des téléchargements
- **quiz** : Quiz et exercices
- **quiz_questions** : Questions de quiz
- **quiz_attempts** : Tentatives de quiz
- **notifications** : Notifications utilisateurs
- **comments** : Commentaires

### Relations

```
users (1) ─────< (N) resources
users (1) ─────< (N) favorites
users (1) ─────< (N) ratings
categories (1) ─< (N) resources
resources (1) ──< (N) downloads
resources (1) ──< (N) ratings
resources (1) ──< (N) favorites
quiz (1) ───────< (N) quiz_questions
quiz (1) ───────< (N) quiz_attempts
```

## 🔒 Sécurité

- **Helmet** : Protection contre les vulnérabilités web courantes
- **Rate Limiting** : Limitation du nombre de requêtes par IP
- **JWT** : Authentification sécurisée par token
- **bcrypt** : Hashage des mots de passe
- **CORS** : Configuration des origines autorisées
- **Validation** : Validation des données avec express-validator

## 🎯 Fonctionnalités

✅ Authentification JWT  
✅ Gestion des utilisateurs  
✅ CRUD complet des ressources  
✅ Système de favoris  
✅ Système d'évaluation (ratings)  
✅ Historique des téléchargements  
✅ Recherche et filtrage avancés  
✅ Pagination  
✅ Gamification (points)  
✅ Système de quiz (WinZone)  
✅ Notifications  
✅ Commentaires  

## 📊 Performance

- **Connexion pooling** : Pool de connexions MySQL optimisé
- **Compression** : Compression gzip des réponses
- **Indexation** : Index sur les champs critiques
- **Vues matérialisées** : Pour les statistiques
- **Cache** : Ready pour Redis (à implémenter)

## 🧪 Tests

```bash
npm test
```

## 📝 Logs

Les logs sont affichés dans la console avec Morgan :
- Mode développement : Format `dev`
- Mode production : Format `combined`

## 🔄 Workflows recommandés

### 1. Créer un nouvel endpoint

1. Créer le contrôleur dans `src/controllers/`
2. Créer la route dans `src/routes/`
3. Ajouter la route au serveur dans `src/server.js`
4. Tester avec Postman/Thunder Client

### 2. Ajouter une nouvelle table

1. Modifier `src/config/database.sql`
2. Exécuter le script SQL
3. Créer le modèle/contrôleur correspondant

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

ISC

## 👤 Auteur

**YAMBOGO BRICE**
- Email: yambogobrice@gmail.com
- LinkedIn: [YAMBOGO BRICE](https://www.linkedin.com/in/yambogo-brice/)
- GitHub: [@yambogobrice-design](https://github.com/yambogobrice-design)

---

**Version:** 1.0.0  
**Date:** Septembre 2026  
**Plateforme:** WinBox Academic Platform
