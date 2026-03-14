# BeyondMemories - Hackathon 2025 🚀

Plateforme de mémorial numérique pour le hackathon BeyondMemories 2025.

## 🎯 Tracks Implémentées

### Track 1: Expérience & Accessibilité
- ✅ Page d'accueil avec design moderne et animations
- ✅ Création de mémorial en 3 étapes simples
- ✅ Interface accessible et responsive
- ✅ Design glassmorphism et gradients

### Track 2: Tech & Intégration
- ✅ Timeline interactive des souvenirs
- ✅ Affichage des photos, vidéos, textes
- ✅ Filtrage et tri des souvenirs
- ✅ API REST complète

### Bonus: 3D (Parcelleland)
- ✅ Espace mémorial 3D avec React Three Fiber
- ✅ Orbes de souvenirs flottants
- ✅ Contrôles de caméra interactifs

## 🏗️ Architecture

```
bym_by_genesis/
├── backend/          # API Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/   # User, Memorial, Memory
│   │   ├── routes/   # auth, memorials, memories
│   │   ├── middleware/
│   │   └── server.ts
│   └── package.json
│
└── bym_by_genesis/   # Frontend Next.js 16
    ├── app/
    │   ├── page.tsx          # Landing page
    │   ├── create/           # Wizard création
    │   └── memorial/[id]/    # Page mémorial
    ├── components/
    │   ├── Timeline.tsx
    │   ├── MemoryCard.tsx
    │   └── 3d/
    │       └── MemorialSpace.tsx
    └── lib/
        ├── api.ts            # Client API
        └── types.ts
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)

### 1. Backend

```bash
cd backend

# Installer les dépendances (déjà fait)
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec votre MongoDB URI

# Démarrer le serveur de développement
npm run dev
```

Le backend démarre sur `http://localhost:5000`

### 2. Frontend

```bash
cd bym_by_genesis

# Les dépendances sont déjà installées
# Si besoin de réinstaller:
# npm install

# Créer .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Démarrer le serveur de développement
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Memorials
- `POST /api/memorials` - Créer un mémorial
- `GET /api/memorials` - Liste des mémoriaux
- `GET /api/memorials/:id` - Détails + souvenirs
- `PUT /api/memorials/:id` - Modifier
- `DELETE /api/memorials/:id` - Supprimer

### Memories
- `POST /api/memories` - Créer un souvenir
- `GET /api/memories` - Liste (avec filtres)
- `POST /api/memories/:id/upload` - Upload média
- `PUT /api/memories/:id` - Modifier
- `DELETE /api/memories/:id` - Supprimer

## 🎨 Stack Technique

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken)
- **Upload**: Multer
- **Validation**: express-validator

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **3D**: React Three Fiber + Drei
- **Web3**: RainbowKit + Wagmi (pour future intégration NFT)
- **HTTP**: Axios

## 🎯 Fonctionnalités Clés

### 1. Création de Mémorial (Track 1)
- Wizard en 3 étapes intuitif
- Personnalisation du thème (couleurs)
- Validation des formulaires
- Design accessible et responsive

### 2. Timeline Interactive (Track 2)
- Affichage chronologique des souvenirs
- Vue timeline ou grille
- Support photos, vidéos, texte, audio
- Tags et localisation
- Animations fluides

### 3. Espace 3D (Bonus)
- Scène 3D immersive
- Orbes de souvenirs flottants
- Rotation automatique
- Contrôles de caméra (zoom, pan, rotate)

## 🎨 Design System

### Couleurs
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#ec4899` (Pink)

### Effets
- Glassmorphism (backdrop-filter blur)
- Gradients dynamiques
- Animations float, glow, slideUp
- Hover effects sur tous les éléments interactifs

## 📝 Notes pour le Hackathon

### Livrables
1. ✅ Parcours utilisateur clair (3 étapes)
2. ✅ Prototype fonctionnel (Figma/app)
3. ✅ Vidéo démo (à créer)
4. ✅ Documentation simple (ce README)

### Points Forts
- **UX Premium**: Design moderne avec glassmorphism et animations
- **Accessibilité**: Formulaires accessibles, navigation claire
- **Innovation**: Espace 3D pour visualiser les souvenirs
- **Tech Stack Moderne**: Next.js 16, React Three Fiber, TypeScript
- **API Complète**: Backend robuste avec authentification

### Améliorations Futures
- Intégration Web3 (NFT pour Life-shop)
- Upload d'images réel (Cloudinary/S3)
- Système de commentaires
- Partage social
- Mode hors-ligne (PWA)
- Tests automatisés

## 🐛 Troubleshooting

### MongoDB ne démarre pas
```bash
# Vérifier que MongoDB est installé et démarré
mongod --version
# Ou utiliser MongoDB Atlas (cloud)
```

### Port déjà utilisé
```bash
# Changer le port dans .env (backend) ou next.config.ts (frontend)
```

### Erreur CORS
```bash
# Vérifier que FRONTEND_URL dans backend/.env correspond au port du frontend
```

## 👥 Équipe

Projet développé pour le hackathon BeyondMemories 2025

## 📄 Licence

MIT

---

**Bon hackathon ! 🚀**
