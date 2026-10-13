# ⚡ Démarrage Rapide - Backend WinBox

## 🎯 En 5 Minutes !

### 1️⃣ Installer MySQL (si pas déjà fait)
```bash
# Windows: Télécharger depuis mysql.com
# Linux:
sudo apt install mysql-server

# macOS:
brew install mysql
```

### 2️⃣ Créer la base de données
```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script
source src/config/database.sql

# Ou en une ligne
mysql -u root -p < src/config/database.sql
```

### 3️⃣ Configurer l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et changer :
# - DB_PASSWORD avec votre mot de passe MySQL
# - JWT_SECRET avec une clé aléatoire
```

### 4️⃣ Installer et démarrer
```bash
npm install
npm run dev
```

### 5️⃣ Tester
Ouvrir : **http://localhost:5000/health**

Vous devriez voir :
```json
{
  "success": true,
  "message": "API WinBox opérationnelle"
}
```

## 🎉 C'est prêt !

### Compte Admin par défaut
- **Email** : admin@winbox.com
- **Mot de passe** : Admin@123

### Tester l'inscription
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@winbox.com",
    "password": "Test@123",
    "niveau": "Licence 2"
  }'
```

## 📚 Prochaines Étapes

1. Lire `README.md` pour la documentation complète
2. Lire `SETUP.md` pour la configuration détaillée
3. Tester les endpoints avec Postman
4. Connecter le frontend

## 🆘 Problèmes ?

**Erreur MySQL ?**
```bash
sudo service mysql start  # Linux
brew services start mysql  # macOS
```

**Port occupé ?**
```bash
# Changer le port dans .env
PORT=5001
```

---

**Besoin d'aide ?** yambogobrice@gmail.com
