# Système d'Authentification WinBox

Ce document explique comment fonctionne le système d'authentification de WinBox et comment l'intégrer avec votre backend.

## 📁 Structure des fichiers

```
frontend/
├── app/
│   ├── Connexion/page.tsx          # Page de connexion
│   ├── Inscription/page.tsx        # Page d'inscription
│   ├── MotDePasseOublie/page.tsx   # Page de récupération de mot de passe
│   └── Contribuer/page.tsx         # Page protégée (exemple)
├── Components/
│   ├── AuthGuard.tsx               # Composant de protection des routes
│   └── Navbar.tsx                  # Navigation avec état de connexion
├── hooks/
│   └── useAuth.ts                  # Hook d'authentification
└── contexts/
    └── AuthContext.tsx             # Contexte React pour l'auth
```

## 🔐 Fonctionnalités

### Pages d'authentification
- ✅ **Connexion** (`/Connexion`)
  - Formulaire email/mot de passe
  - Option "Se souvenir de moi"
  - Affichage/masquage du mot de passe
  - Connexion sociale (Google, GitHub)
  - Gestion des erreurs

- ✅ **Inscription** (`/Inscription`)
  - Formulaire complet (prénom, nom, email, mot de passe)
  - Validation en temps réel
  - Confirmation du mot de passe
  - Acceptation des conditions
  - Inscription sociale

- ✅ **Mot de passe oublié** (`/MotDePasseOublie`)
  - Envoi d'email de réinitialisation
  - Confirmation visuelle
  - Option de renvoi

### Composants de protection

#### AuthGuard
Protège une page et redirige vers `/Connexion` si l'utilisateur n'est pas connecté.

```tsx
import AuthGuard from "@/Components/AuthGuard";

export default function PageProtegee() {
  return (
    <AuthGuard message="Vous devez être connecté pour accéder à cette page">
      {/* Votre contenu protégé */}
    </AuthGuard>
  );
}
```

#### useAuth Hook
Permet d'accéder aux fonctions d'authentification partout dans l'app.

```tsx
import { useAuth } from "@/hooks/useAuth";

function MonComposant() {
  const { 
    utilisateur, 
    estConnecte, 
    connexion, 
    deconnexion 
  } = useAuth();

  // Utiliser les fonctions...
}
```

## 🔧 Configuration Backend

### 1. Stockage actuel (temporaire)
Le système utilise actuellement `localStorage` pour stocker :
- `authToken` : Token JWT
- `userData` : Informations de l'utilisateur

### 2. À implémenter

#### Dans `hooks/useAuth.ts`

**Fonction connexion :**
```typescript
const connexion = async (email: string, motDePasse: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse }),
    });

    if (!response.ok) throw new Error('Connexion échouée');

    const data = await response.json();
    const { token, user } = data;

    // Sauvegarder
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));

    setUtilisateur(user);
    setEstConnecte(true);

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**Fonction inscription :**
```typescript
const inscription = async (prenom, nom, email, motDePasse) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, nom, email, motDePasse }),
    });

    if (!response.ok) throw new Error('Inscription échouée');

    const data = await response.json();
    // Même logique que connexion...
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**Vérification du token :**
```typescript
const verifierAuthentification = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    setEstConnecte(false);
    setChargement(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Token invalide');

    const userData = await response.json();
    setUtilisateur(userData);
    setEstConnecte(true);
  } catch (error) {
    // Token invalide, nettoyer
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setEstConnecte(false);
  } finally {
    setChargement(false);
  }
};
```

## 🛡️ Protéger des routes

### Exemple 1 : Page complète
```tsx
// app/Contribuer/page.tsx
import AuthGuard from "@/Components/AuthGuard";

export default function ContribuerPage() {
  return (
    <AuthGuard message="Connexion requise pour contribuer">
      <div>
        {/* Contenu protégé */}
      </div>
    </AuthGuard>
  );
}
```

### Exemple 2 : Conditionnel dans un composant
```tsx
import { useAuth } from "@/hooks/useAuth";

function MonComposant() {
  const { estConnecte, utilisateur } = useAuth();

  if (!estConnecte) {
    return <div>Veuillez vous connecter</div>;
  }

  return <div>Bonjour {utilisateur.prenom}</div>;
}
```

### Exemple 3 : Redirection programmatique
```tsx
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PageProtegee() {
  const { estConnecte, chargement } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!chargement && !estConnecte) {
      router.push('/Connexion');
    }
  }, [estConnecte, chargement, router]);

  if (chargement) return <div>Chargement...</div>;
  if (!estConnecte) return null;

  return <div>Contenu protégé</div>;
}
```

## 🎨 Personnalisation

### Modifier le message d'AuthGuard
```tsx
<AuthGuard message="Votre message personnalisé ici">
  {/* ... */}
</AuthGuard>
```

### Changer le délai de redirection
Dans `Components/AuthGuard.tsx`, ligne ~30 :
```typescript
setTimeout(() => {
  router.push("/Connexion");
}, 3000); // Modifier cette valeur (en millisecondes)
```

### Ajouter des rôles/permissions
Dans `hooks/useAuth.ts`, étendre l'interface User :
```typescript
interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  avatar?: string;
  role?: "etudiant" | "admin" | "moderateur";
  permissions?: string[];
}
```

Puis vérifier dans vos composants :
```tsx
const { utilisateur } = useAuth();

if (utilisateur?.role === "admin") {
  // Afficher contenu admin
}
```

## 🔒 Sécurité

### Recommandations

1. **HTTPS obligatoire** en production
2. **HttpOnly cookies** pour les tokens (plus sécurisé que localStorage)
3. **Tokens avec expiration** courte (15-30 min)
4. **Refresh tokens** pour renouveler automatiquement
5. **CSRF protection** sur toutes les routes d'API
6. **Rate limiting** sur les endpoints d'authentification
7. **Validation côté serveur** de toutes les données

### Exemple avec cookies (recommandé)
```typescript
// Au lieu de localStorage
const connexion = async (email, motDePasse) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Important pour les cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  });
  // Le serveur définit un cookie HttpOnly automatiquement
};
```

## 📝 TODO Backend

- [ ] Créer les routes API :
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
  - `GET /api/auth/verify`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`

- [ ] Implémenter JWT avec refresh tokens
- [ ] Ajouter validation des emails
- [ ] Configurer OAuth (Google, GitHub)
- [ ] Mettre en place le rate limiting
- [ ] Créer middleware d'authentification
- [ ] Gérer les sessions utilisateurs

## 🧪 Test rapide

Pour tester sans backend :

1. Aller sur `/Connexion`
2. Entrer n'importe quel email/mot de passe
3. Cliquer sur "Se connecter"
4. Vous serez connecté (simulation)
5. Essayer d'accéder à `/Contribuer` (page protégée)
6. Vous devriez voir le contenu car vous êtes "connecté"

Pour tester la protection :
1. Ouvrir la console du navigateur
2. Taper : `localStorage.clear()`
3. Rafraîchir la page
4. Aller sur `/Contribuer`
5. Vous serez redirigé vers `/Connexion`

## 📞 Support

Pour toute question sur l'authentification, consultez :
- `frontend/hooks/useAuth.ts` - Logique principale
- `frontend/Components/AuthGuard.tsx` - Protection des routes
- `frontend/app/Connexion/page.tsx` - Exemple d'utilisation

---

**Important** : Remplacez tous les `TODO` par vos vraies implémentations avant de passer en production !
