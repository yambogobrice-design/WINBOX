# 🚀 Guide de Configuration Backend WinBox

## Étape 1 : Installation de MySQL

### Windows
1. Télécharger MySQL depuis [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Installer MySQL Server
3. Noter le mot de passe root défini lors de l'installation

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### macOS
```bash
brew install mysql
brew services start mysql
```

## Étape 2 : Configuration de la base de données

### Se connecter à MySQL
```bash
mysql -u root -p
```

### Créer la base de données
```sql
CREATE DATABASE winbox_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Créer un utilisateur dédié (recommandé)
```sql
CREATE USER 'winbox_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON winbox_db.* TO 'winbox_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Importer le schéma de base de données

Le plus simple, une fois les dépendances installées (étape 4) et `.env` renseigné :

```bash
npm run db:init   # crée la base, les 19 tables, les vues et les données de référence
npm run seed      # crée le compte administrateur (mot de passe haché)
```

Sinon, avec le client MySQL :

```bash
mysql -u winbox_user -p < src/config/database.sql
```

Le script `database.sql` est idempotent : il peut être rejoué sans erreur.

## Étape 3 : Configuration de l'environnement

### Créer le fichier .env
```bash
cp .env.example .env
```

### Éditer .env avec vos paramètres
```env
NODE_ENV=development
PORT=5000

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=winbox_user
DB_PASSWORD=votre_mot_de_passe_fort
DB_NAME=winbox_db

# JWT Secret (IMPORTANT: Générer une clé aléatoire sécurisée)
JWT_SECRET=changez_moi_par_une_cle_aleatoire_tres_longue_et_securisee
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Générer une clé JWT sécurisée
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Étape 4 : Installation des dépendances

```bash
npm install
```

## Étape 5 : Vérification

### Démarrer le serveur en mode développement
```bash
npm run dev
```

### Tester la connexion
Ouvrir dans le navigateur : `http://localhost:5000/health`

Vous devriez voir :
```json
{
  "success": true,
  "message": "API WinBox opérationnelle",
  "version": "2.0.0"
}
```

### Vérifications statiques (sans base de données)

```bash
npm run verify
```

Ce script contrôle la syntaxe, les imports/exports, la cohérence du schéma SQL et
affiche l'inventaire des routes exposées.

## Étape 6 : Tester l'authentification

### Inscription
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@winbox.com",
    "password": "Test@123",
    "niveau": "Licence 2",
    "filiere": "Informatique"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@winbox.com",
    "password": "Test@123"
  }'
```

## Étape 7 : Compte Admin

Le compte administrateur est créé par `npm run seed` (le mot de passe est haché
par bcrypt et n'est jamais stocké en clair) :

- **Email** : `admin@winbox.com` (ou `ADMIN_EMAIL`)
- **Mot de passe** : `Admin@123` (ou `ADMIN_PASSWORD`)

Pour définir un autre mot de passe dès le départ :

```bash
ADMIN_PASSWORD='MonMotDePasseFort!2026' npm run seed
```

⚠️ **IMPORTANT** : Changez ce mot de passe en production !

Pour vérifier l'accès administrateur :

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@winbox.com","password":"Admin@123"}'
```

Puis, avec le jeton reçu :

```bash
curl http://localhost:5000/api/v1/admin/stats -H "Authorization: Bearer <token>"
```

## 🔧 Dépannage

### Erreur : "Access denied for user"
- Vérifier les identifiants dans `.env`
- Vérifier que l'utilisateur MySQL existe
- Vérifier les permissions de l'utilisateur

### Erreur : "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port already in use"
```bash
# Trouver le processus utilisant le port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Changer le port dans .env
PORT=5001
```

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL est démarré
sudo service mysql status  # Linux
brew services list  # macOS

# Démarrer MySQL si arrêté
sudo service mysql start  # Linux
brew services start mysql  # macOS
```

## 📚 Ressources

- [Documentation Express](https://expressjs.com/)
- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Documentation JWT](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Changer le mot de passe admin par défaut
- [ ] Générer une nouvelle clé JWT sécurisée
- [ ] Configurer CORS avec les bonnes origines
- [ ] Activer les logs en production
- [ ] Configurer les sauvegardes de la base de données
- [ ] Activer HTTPS
- [ ] Configurer un reverse proxy (Nginx)
- [ ] Mettre en place un monitoring (PM2, New Relic)
- [ ] Configurer les variables d'environnement sur le serveur

---

**Besoin d'aide ?** Contactez YAMBOGO BRICE - yambogobrice@gmail.com
