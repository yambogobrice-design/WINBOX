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

### 2️⃣ Installer les dépendances et préparer la base
```bash
npm install
cp .env.example .env      # puis renseigner DB_PASSWORD et JWT_SECRET

npm run db:init           # crée la base, les tables, les vues et les données de référence
npm run seed              # crée le compte administrateur
```

Si vous préférez le client MySQL :
```bash
mysql -u root -p < src/config/database.sql
```

### 3️⃣ Configurer l'environnement
```bash
# Éditer .env et changer :
# - DB_PASSWORD avec votre mot de passe MySQL
# - JWT_SECRET avec une clé aléatoire
```

### 4️⃣ Démarrer
```bash
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

### Vérifier le code sans base de données
```bash
npm run verify
```

### Compte Admin par défaut (créé par `npm run seed`)
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
    "motDePasse": "Test@1234",
    "niveau": "Licence 2"
  }'
```

### Explorer l'API
- Collection Postman : `WinBox.postman_collection.json` (régénérable avec `npm run postman`)
- Référence complète : `API.md`

## 📚 Prochaines Étapes

1. Lire `API.md` pour la référence des endpoints
2. Lire `README.md` pour l'architecture et les scripts
3. Lire `SETUP.md` pour la configuration détaillée
4. Connecter le frontend (voir la section « Correspondance avec les pages du frontend » dans `API.md`)

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
