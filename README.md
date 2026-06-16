# Système d'Inscription aux Cours - Frontend

Frontend moderne et complet pour un système d'inscription aux cours, construit avec **Next.js 14**, **TypeScript** et **Tailwind CSS**.

## 🎯 Fonctionnalités

- **Dashboard** : Consultation des inscriptions personnelles avec possibilité d'annulation (règle des 24h)
- **Gestion des étudiants** : Créer et lister tous les étudiants
- **Gestion des cours** : Créer et lister tous les cours
- **Inscriptions** : Inscrire un étudiant à un cours avec gestion des erreurs (limite de 3 étudiants par cours)
- **Navigation responsive** : Interface adaptée mobile et desktop
- **Gestion d'erreurs complète** : Messages clairs pour tous les cas d'erreur

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **API Client** : Fetch natif avec gestion centralisée

## 📋 Prérequis

- Node.js 16.8+ et npm/yarn
- Backend API accessible sur `http://localhost:8080/api`

## 🚀 Installation et Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

Le fichier `.env.local` est déjà configuré avec :

```
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
```

Modifiez cette valeur si votre API est sur un port/domaine différent.

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible à `http://localhost:3000`

### 4. Build pour la production

```bash
npm run build
npm start
```

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout principal avec Navbar
│   │   ├── page.tsx             # Dashboard (page d'accueil)
│   │   ├── globals.css          # Styles globaux + Tailwind
│   │   ├── students/
│   │   │   └── page.tsx         # Gestion des étudiants
│   │   ├── courses/
│   │   │   └── page.tsx         # Gestion des cours
│   │   └── enrollments/
│   │       └── page.tsx         # Inscriptions
│   ├── components/
│   │   └── Navbar.tsx           # Barre de navigation
│   ├── lib/
│   │   └── api.ts               # Appels API centralisés
│   └── types/
│       └── index.ts             # Interfaces TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .env.local                   # Variables d'environnement
└── README.md
```

## 🔌 Endpoints API Utilisés

### Étudiants
- `GET /api/students` - Lister tous les étudiants
- `POST /api/students` - Créer un étudiant
- `GET /api/students/cnie/{cnie}` - Récupérer un étudiant par CNIE

### Cours
- `GET /api/courses` - Lister tous les cours
- `POST /api/courses` - Créer un cours
- `GET /api/courses/{id}` - Récupérer un cours par ID

### Inscriptions
- `GET /api/enrollments/student/{cnie}` - Lister les inscriptions d'un étudiant
- `POST /api/enrollments` - Créer une inscription
- `DELETE /api/enrollments/{id}/student/{cnie}` - Annuler une inscription

## 📖 Pages et Fonctionnalités

### 1. Dashboard (/)
- Recherche par CNIE
- Affichage des cours inscrits
- Annulation d'inscription (avec règle des 24h)
- Messages de succès/erreur

### 2. Étudiants (/students)
- Tableau avec tous les étudiants
- Formulaire d'ajout
- Feedback en temps réel

### 3. Cours (/courses)
- Affichage détaillé des cours
- Formulaire de création
- Affichage des crédits

### 4. Inscriptions (/enrollments)
- Sélection étudiant (dropdown)
- Sélection cours (dropdown)
- Gestion des erreurs (cours complet)
- Affichage des listes disponibles

## ✅ Règles Métier Implémentées

1. **Limite de 3 étudiants par cours** : Message d'erreur spécifique si dépassement
2. **Règle des 24h** : Bouton d'annulation désactivé si `deletable: false`
3. **Validation des formulaires** : Tous les champs obligatoires validés
4. **Gestion CORS** : Compatible avec le backend configuré

## 🎨 Design et UX

- Interface claire et intuitive
- Couleurs professionnelles (bleu primaire, rouge pour les actions destructrices)
- Responsive design (mobile, tablette, desktop)
- Messages d'erreur explicites
- États de chargement visibles
- Confirmations pour les actions destructrices

## 🐛 Résolution de Problèmes

### L'API retourne une erreur CORS
- Vérifiez que le backend accepte les requêtes de `http://localhost:3000`
- Vérifiez que `NEXT_PUBLIC_API_BASE` pointe vers le bon endpoint

### Les données ne se chargent pas
- Assurez-vous que le backend tourne sur `http://localhost:8080`
- Vérifiez la console du navigateur (F12) pour les erreurs réseau

### Port 3000 déjà utilisé
```bash
npm run dev -- -p 3001
```

## 📝 Notes de Développement

- Tous les appels API sont centralisés dans `src/lib/api.ts`
- Les types TypeScript sont définies dans `src/types/index.ts`
- Utilisation de composants React avec hooks (`useState`, `useEffect`)
- Pas de dépendances externes pour la gestion d'état (pas React Query)
- Code organisé et commenté pour la maintenabilité

## 📄 Licence

Libre d'utilisation pour ce projet d'école/entreprise.
