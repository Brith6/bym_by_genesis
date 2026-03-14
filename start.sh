#!/bin/bash

# BeyondMemories - Startup Script

echo "🚀 Démarrage de BeyondMemories..."

# Vérifier MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé. Installez-le ou utilisez MongoDB Atlas."
    echo "   Continuons quand même..."
fi

# Démarrer le backend
echo "📡 Démarrage du backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd ../bym_by_genesis
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ BeyondMemories est en cours de démarrage!"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Pour arrêter les serveurs, appuyez sur Ctrl+C"
echo ""

# Attendre les processus
wait $BACKEND_PID $FRONTEND_PID
