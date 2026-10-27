# API WinBox — référence

Base URL : `http://localhost:5000/api/v1`
Santé : `GET /health` · Uploads statiques : `/uploads/<fichier>`

---

## 1. Conventions

### Enveloppe de réponse

Toutes les réponses JSON suivent le même format :

```json
// Succès
{ "success": true, "message": "Connexion réussie", "data": { } }

// Erreur
{ "success": false, "message": "Email ou mot de passe incorrect" }

// Erreur de validation
{ "success": false, "message": "Erreur de validation",
  "errors": [ { "field": "email", "message": "Email invalide" } ] }
```

### Authentification

```http
Authorization: Bearer <token>
```

Le jeton est un JWT signé (`JWT_SECRET`), valable `JWT_EXPIRE` (7 jours par défaut).
La déconnexion est côté client (suppression du jeton) ; `POST /auth/logout` existe
comme point d'appel unique.

### Rôles

| Rôle | Droits |
|---|---|
| `etudiant` | Lecture, favoris, téléchargements, objectifs, défis, contribution (soumise à validation) |
| `contributeur` | Identique à `etudiant` (rôle mis en avant dans l'interface) |
| `admin` | Modération, gestion des utilisateurs, statistiques ; ses dépôts sont publiés directement |

Statuts de compte : `actif` (connexion autorisée), `inactif`, `suspendu` (connexion refusée).

### Noms de champs français acceptés

Le frontend envoie `motDePasse`, `nouveauMotDePasse`, `ancienMotDePasse`.
Un middleware les traduit en `password`, `newPassword`, `currentPassword` :
les deux écritures fonctionnent.

### Matières

Les matières sont les `categories` (Mathématiques, Physique, …). Partout où une
matière est attendue, le **slug** (`mathematiques`) ou le **libellé**
(`Mathématiques`) est accepté. Une matière inconnue renvoie `400` avec la liste
des valeurs autorisées.

### Pagination

Paramètres : `page` (≥ 1), `limit` (1–100). Réponse :

```json
"pagination": {
  "totalItems": 42, "totalPages": 3, "currentPage": 1,
  "itemsPerPage": 20, "hasNextPage": true, "hasPrevPage": false
}
```

### Filtres de liste

Les valeurs de menus déroulants (`Tous`, `Toutes`, `tous`, `toutes`) sont ignorées.

| Paramètre | Effet |
|---|---|
| `type` | `livre` \| `cours` \| `sujet` \| `correction` \| `support` |
| `matiere` | slug ou libellé de la matière |
| `category_id` | identifiant numérique de la matière |
| `niveau` | `Licence 1` … `Master 2` (libellé libre) |
| `filiere` | recherche partielle |
| `annee` | année académique (`2023-2024`) |
| `search` | titre, description et auteur |
| `sort` | `recent` \| `ancien` \| `populaire` \| `vues` \| `note` \| `titre` (défaut `recent`) |
| `status` | (admin) `en_attente` \| `validee` \| `refusee` |

---

## 2. Authentification — `/auth`

| Méthode | Chemin | Accès | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Inscription (`nom`, `prenom`, `email`, `password` ≥ 8) |
| POST | `/auth/login` | Public | Connexion |
| POST | `/auth/forgot-password` | Public | Demande de réinitialisation (`email`) |
| POST | `/auth/reset-password` | Public | Réinitialisation (`token`, `password`) |
| GET | `/auth/me` | Connecté | Profil + statistiques agrégées |
| PUT/PATCH | `/auth/profile` | Connecté | Mise à jour du profil |
| PUT | `/auth/change-password` | Connecté | Changement de mot de passe |
| POST | `/auth/logout` | Connecté | Déconnexion (informatif) |

**Connexion**

```http
POST /api/v1/auth/login
{ "email": "etudiant@winbox.com", "motDePasse": "motdepasse123" }
```

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 4, "nom": "Dupont", "prenom": "Jean", "email": "etudiant@winbox.com",
      "niveau": "Licence 2", "filiere": "Informatique", "role": "etudiant",
      "status": "actif", "points": 120, "preferences": null
    },
    "token": "eyJhbGciOi…",
    "stats": {
      "contributions": 2, "contributions_en_attente": 1, "telechargements": 12,
      "quiz_completes": 4, "taux_reussite": 82, "badges": 2, "favoris": 3,
      "minutes_etude": 320, "rang": 42
    }
  }
}
```

**Mot de passe oublié** — aucun transport email n'est configuré : le lien est
journalisé côté serveur. Si `EXPOSE_RESET_TOKEN=true` (développement), le jeton
est aussi renvoyé dans la réponse :

```json
{ "success": true, "message": "Si un compte existe…",
  "data": { "expireDansMinutes": 60, "token": "…", "lien": "http://localhost:3000/MotDePasseOublie?token=…" } }
```

La réponse est identique que l'email existe ou non (pas d'énumération de comptes).

---

## 3. Utilisateur connecté — `/users`

| Méthode | Chemin | Accès | Description |
|---|---|---|---|
| GET | `/users/me/stats` | Connecté | Statistiques détaillées + badges (profil, « Aperçu ») |
| GET | `/users/me/activities` | Connecté | Fil d'activité (`?type=&page=&limit=`) |
| PATCH | `/users/me/preferences` | Connecté | `{ preferences: { notifications_email, profil_public, participer_classement } }` |

`/users/me/activities` renvoie `activities` (type, titre, points, matière, date),
`points_30_jours` et la pagination. Types d'activité : `inscription`, `quiz`,
`telechargement`, `contribution`, `objectif`, `defi`, `badge`, `session`.

---

## 4. Ressources — `/resources`

| Méthode | Chemin | Accès | Description |
|---|---|---|---|
| GET | `/resources` | Public | Liste filtrée + pagination (`is_favorite` si connecté) |
| GET | `/resources/mine` | Connecté | Mes dépôts, tous statuts + compteurs |
| GET | `/resources/:id` | Public* | Détail, ressources similaires, +1 vue |
| POST | `/resources` | Connecté | Dépôt/contribution (`multipart/form-data`) |
| PUT/PATCH | `/resources/:id` | Auteur ou admin | Mise à jour |
| DELETE | `/resources/:id` | Auteur ou admin | Suppression logique |
| POST | `/resources/:id/download` | Connecté | Enregistre le téléchargement, +1 point |
| GET | `/resources/:id/file` | Connecté | Envoie le fichier (téléchargement comptabilisé) |
| POST | `/resources/:id/favorite` | Connecté | Ajout aux favoris |

\* Une ressource non validée n'est visible que par son auteur et les admins.

**Dépôt d'une ressource** (`multipart/form-data`) :

| Champ | Requis | Note |
|---|---|---|
| `fichier` | non | PDF, DOC(X), PPT(X), XLS(X), TXT, ZIP — max `MAX_FILE_SIZE` |
| `titre` | oui | 3 caractères minimum |
| `type` | oui | `livre` \| `cours` \| `sujet` \| `correction` \| `support` |
| `matiere` | non | slug ou libellé |
| `auteur` | non | auteur de l'ouvrage / du sujet |
| `niveau`, `filiere`, `annee_academique`, `description`, `tags` | non | `tags` = tableau JSON |

Un dépôt d'utilisateur est créé en `en_attente` (+5 points). La validation par un
administrateur attribue +50 points et notifie l'auteur. Modifier une ressource
validée la remet en modération.

---

## 5. Favoris — `/favorites`

| Méthode | Chemin | Description |
|---|---|---|
| GET | `/favorites` | Mes favoris (`?type=&matiere=&search=`) |
| POST | `/favorites` | `{ resource_id }` |
| POST | `/favorites/:id` | `:id` = identifiant de la ressource |
| DELETE | `/favorites/:id` | `:id` = identifiant du favori **ou** de la ressource |
| DELETE | `/favorites` | Vide la liste |

---

## 6. Catalogue — `/categories`, `/badges`

| Méthode | Chemin | Accès | Description |
|---|---|---|---|
| GET | `/categories` | Public | Matières + nombre de ressources validées |
| GET | `/categories/:slug` | Public | Détail + répartition par type |
| GET | `/badges` | Public | Catalogue des badges |
| GET | `/badges/me` | Connecté | Mes badges (`obtenu`, `obtained_at`) + progression |

---

## 7. Notifications — `/notifications`

| Méthode | Chemin | Description |
|---|---|---|
| GET | `/notifications` | Mes notifications (`?unread=true`) + `non_lues` |
| PATCH | `/notifications/read-all` | Tout marquer comme lu |
| PATCH | `/notifications/:id/read` | Marquer une notification |
| DELETE | `/notifications/:id` | Supprimer |

Notifications générées automatiquement : bienvenue, badge débloqué, contribution
reçue/validée/refusée, mot de passe modifié/réinitialisé.

---

## 8. Administration — `/admin` (rôle `admin` requis)

| Méthode | Chemin | Description |
|---|---|---|
| GET | `/admin/stats` | Tableau de bord (`?periode=7j\|30j\|90j`) |
| GET | `/admin/activity` | Journal d'activité de la plateforme |
| GET | `/admin/pending` | File de modération |
| GET | `/admin/resources` | Toutes les ressources (`?status=&type=&search=`) + statistiques |
| PATCH | `/admin/resources/:id/status` | `{ status, comment }` — `comment` obligatoire si `refusee` |
| GET | `/admin/users` | Utilisateurs (`?role=&status=&search=`) + statistiques |
| GET | `/admin/users/:id` | Détail : ressources, activités, badges |
| PATCH | `/admin/users/:id` | `{ role, status, points, is_verified }` |
| DELETE | `/admin/users/:id` | Désactive le compte (les administrateurs sont protégés) |

`/admin/stats` renvoie `stats.{utilisateurs,ressources,telechargements,contributions}`
avec `total`, compteurs détaillés et `evolution` (variation vs période précédente),
ainsi que `ressourcesPopulaires` (top 5) et `actionsEnAttente`.

---

## 9. Correspondance avec les pages du frontend

| Page / composant | Endpoints |
|---|---|
| `Connexion` | `POST /auth/login` |
| `Inscription` | `POST /auth/register` |
| `MotDePasseOublie` | `POST /auth/forgot-password`, puis `POST /auth/reset-password` |
| `Navbar` (menu utilisateur) | `GET /auth/me`, `POST /auth/logout` |
| `Profil` — en-tête | `GET /auth/me` (`user` + `stats.rang`, `points`, `quiz_completes`, `taux_reussite`) |
| `Profil` — Aperçu | `GET /users/me/stats` (statistiques + `contributions_detail`) |
| `Profil` — Activité | `GET /users/me/activities` |
| `Profil` — Badges | `GET /badges/me` |
| `Profil` — Paramètres | `PUT /auth/profile`, `PATCH /users/me/preferences`, `PUT /auth/change-password` |
| `Favoris` | `GET /favorites`, `DELETE /favorites/:id`, `DELETE /favorites` |
| `Contribuer` | `POST /resources` (multipart), `GET /resources/mine` |
| `Livres` / `Cours&Supports` / `Sujets` / `Corrections` | `GET /resources?type=…`, `GET /categories` |
| `Recherche` | `GET /resources?search=…` (+ filtres) |
| `Admin/Dashboard` | `GET /admin/stats`, `GET /admin/activity`, `GET /admin/pending` |
| `Admin/Gestion_utilisateurs` | `GET /admin/users`, `PATCH /admin/users/:id`, `DELETE /admin/users/:id` |
| `Admin/Gestion_ressources` | `GET /admin/resources`, `PATCH /admin/resources/:id/status` |

### Points d'attention pour le branchement

- Le frontend stocke `authToken` et `userData` dans `localStorage` : après
  `POST /auth/login`, enregistrer `data.token` et `data.user`.
- Le type `AuthResult` du hook `useAuth` (`{ success, user }` / `{ success, error }`)
  correspond à `data.user` et `message` de l'API.
- Les identifiants d'URL sont validés (`id` entier positif) : un id invalide
  renvoie `400`, un id inexistant `404`.

---

## 10. Vérifications

```bash
npm run verify   # syntaxe, imports/exports, cohérence SQL, inventaire des routes
npm test         # identique
```

Le script `scripts/verifier-code.mjs` ne nécessite ni `node_modules` ni MySQL.

---

## 11. Limites connues / suite

- **Aucun transport email** : `forgot-password` journalise le lien. Brancher un
  service (SMTP, Resend…) dans `authController.forgotPassword`.
- **Notes (`ratings`) et commentaires** : tables présentes, endpoints non exposés
  (aucune interface ne les utilise aujourd'hui).
- **Quiz** : tables présentes, endpoints non exposés.
- **Révocation de jeton** : JWT sans état ; `logout` n'invalide pas le jeton côté
  serveur. Une liste de révocation ou des jetons courts + refresh sont à prévoir.
- **Signalements** (utilisés par le journal admin) : pas de table dédiée.
