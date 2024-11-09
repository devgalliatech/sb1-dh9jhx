#!/bin/bash

# Configuration
API_URL="https://api.galliatech.com"
TOKEN=""

# Couleurs pour le formatage
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo "Erreur: $3"
    fi
}

echo "🚀 Début des tests de l'API..."

# Test 1: Health Check
echo -e "\n📋 Test du health check..."
HEALTH_RESPONSE=$(curl -k -s "$API_URL/health")
if [[ $HEALTH_RESPONSE == *"API GalliaTech opérationnelle"* ]]; then
    print_result 0 "Health check réussi"
else
    print_result 1 "Health check échoué" "$HEALTH_RESPONSE"
fi

# Test 2: Inscription
echo -e "\n📋 Test de l'inscription..."
REGISTER_RESPONSE=$(curl -k -s -X POST "$API_URL/api/auth/register" \
-H "Content-Type: application/json" \
-d '{
  "email": "test@galliatech.com",
  "password": "Test123!",
  "firstName": "Jean",
  "lastName": "Dupont"
}')
if [[ $REGISTER_RESPONSE == *"token"* ]]; then
    print_result 0 "Inscription réussie"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    print_result 1 "Inscription échouée" "$REGISTER_RESPONSE"
fi

# Test 3: Connexion
echo -e "\n📋 Test de la connexion..."
LOGIN_RESPONSE=$(curl -k -s -X POST "$API_URL/api/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "test@galliatech.com",
  "password": "Test123!"
}')
if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    print_result 0 "Connexion réussie"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    print_result 1 "Connexion échouée" "$LOGIN_RESPONSE"
fi

# Test 4: Création d'un projet
echo -e "\n📋 Test de création d'un projet..."
PROJECT_RESPONSE=$(curl -k -s -X POST "$API_URL/api/projects" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "title": "Projet Test",
  "description": "Description du projet test",
  "goalAmount": 10000,
  "endDate": "2024-12-31",
  "category": "Technology"
}')
if [[ $PROJECT_RESPONSE == *"_id"* ]]; then
    print_result 0 "Création du projet réussie"
    PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
else
    print_result 1 "Création du projet échouée" "$PROJECT_RESPONSE"
fi

# Test 5: Récupération du tableau de bord
echo -e "\n📋 Test de récupération du tableau de bord..."
DASHBOARD_RESPONSE=$(curl -k -s "$API_URL/api/dashboard/projects" \
-H "Authorization: Bearer $TOKEN")
if [[ $DASHBOARD_RESPONSE == *"["* ]]; then
    print_result 0 "Récupération du tableau de bord réussie"
else
    print_result 1 "Récupération du tableau de bord échouée" "$DASHBOARD_RESPONSE"
fi

# Test 6: Création d'un commentaire
if [ ! -z "$PROJECT_ID" ]; then
    echo -e "\n📋 Test de création d'un commentaire..."
    COMMENT_RESPONSE=$(curl -k -s -X POST "$API_URL/api/comments/$PROJECT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "content": "Super projet !"
    }')
    if [[ $COMMENT_RESPONSE == *"_id"* ]]; then
        print_result 0 "Création du commentaire réussie"
    else
        print_result 1 "Création du commentaire échouée" "$COMMENT_RESPONSE"
    fi
fi

# Test 7: Création d'une contribution
if [ ! -z "$PROJECT_ID" ]; then
    echo -e "\n📋 Test de création d'une contribution..."
    CONTRIBUTION_RESPONSE=$(curl -k -s -X POST "$API_URL/api/contributions/$PROJECT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "amount": 100,
      "message": "Bonne chance !"
    }')
    if [[ $CONTRIBUTION_RESPONSE == *"contribution"* ]]; then
        print_result 0 "Création de la contribution réussie"
    else
        print_result 1 "Création de la contribution échouée" "$CONTRIBUTION_RESPONSE"
    fi
fi

# Test 8: Récupération des notifications
echo -e "\n📋 Test de récupération des notifications..."
NOTIFICATIONS_RESPONSE=$(curl -k -s "$API_URL/api/notifications" \
-H "Authorization: Bearer $TOKEN")
if [[ $NOTIFICATIONS_RESPONSE == *"["* ]]; then
    print_result 0 "Récupération des notifications réussie"
else
    print_result 1 "Récupération des notifications échouée" "$NOTIFICATIONS_RESPONSE"
fi

echo -e "\n✅ Tests terminés !"