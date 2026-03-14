# 🚀 Démarrage Rapide - BeyondMemories

## Option 1: Sans MongoDB (pour tester le frontend uniquement)

Le frontend peut fonctionner indépendamment pour voir le design et les animations.

```bash
cd bym_by_genesis
npm run dev
```

Ouvre http://localhost:3000 pour voir la landing page ! 🎨

## Option 2: Avec MongoDB (backend complet)

### A. Installer MongoDB

**Sur Ubuntu/WSL:**
```bash
# Installer MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Démarrer MongoDB
sudo service mongodb start

# Vérifier que MongoDB fonctionne
mongod --version
```

**Ou utiliser MongoDB Atlas (cloud - gratuit):**
1. Va sur https://www.mongodb.com/cloud/atlas
2. Crée un compte gratuit
3. Crée un cluster
4. Obtiens ton URI de connexion
5. Mets-le dans `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondmemories
   ```

### B. Démarrer le Backend

```bash
cd backend
npm run dev
```

Le backend démarre sur http://localhost:5000

### C. Démarrer le Frontend

```bash
cd bym_by_genesis
npm run dev
```

Le frontend démarre sur http://localhost:3000

## 🎯 Test Rapide

1. **Landing Page**: http://localhost:3000
   - Animations et design glassmorphism
   - Bouton "Créer un mémorial"

2. **Wizard Création**: http://localhost:3000/create
   - 3 étapes avec barre de progression
   - Personnalisation du thème

3. **Health Check API**: http://localhost:5000/api/health
   - Vérifie que le backend fonctionne

## ⚠️ Problèmes Courants

### "Permission denied" pour ts-node-dev
Le backend va quand même démarrer, ignore ce warning.

### "MongoDB connection failed"
Le serveur démarre quand même ! Les endpoints API retourneront des erreurs jusqu'à ce que MongoDB soit connecté.

### "Port already in use"
Change le port dans `.env`:
```
PORT=5001  # au lieu de 5000
```

## 📝 Pour le Hackathon

Tu peux présenter:
1. **Le design** - Landing page et wizard (fonctionne sans backend)
2. **L'architecture** - Montre le code backend/frontend
3. **Les features** - Timeline, 3D, etc.

Même sans MongoDB, le frontend est impressionnant ! 🔥
