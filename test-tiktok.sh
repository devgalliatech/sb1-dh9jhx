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

echo "🚀 Début des tests de l'intégration TikTok..."

# Test 1: Obtention de l'URL d'authentification
echo -e "\n📋 Test de l'URL d'authentification TikTok..."
AUTH_RESPONSE=$(curl -k -s "$API_URL/api/tiktok/auth" \
-H "Authorization: Bearer $TOKEN")
if [[ $AUTH_RESPONSE == *"tiktok.com/auth/authorize"* ]]; then
    print_result 0 "URL d'authentification obtenue"
else
    print_result 1 "Échec de l'obtention de l'URL" "$AUTH_RESPONSE"
fi

# Test 2: Récupération des informations du compte
echo -e "\n📋 Test de récupération des informations du compte TikTok..."
ACCOUNT_RESPONSE=$(curl -k -s "$API_URL/api/tiktok/account" \
-H "Authorization: Bearer $TOKEN")
if [[ $ACCOUNT_RESPONSE == *"tiktokId"* ]]; then
    print_result 0 "Informations du compte récupérées"
else
    print_result 1 "Échec de la récupération des informations" "$ACCOUNT_RESPONSE"
fi

# Test 3: Configuration des mises à jour automatiques
echo -e "\n📋 Test de configuration des mises à jour automatiques..."
UPDATE_RESPONSE=$(curl -k -s -X POST "$API_URL/api/tiktok/projects/PROJECT_ID/auto-updates" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "frequency": "milestone",
  "milestoneThresholds": [25, 50, 75, 100],
  "templates": ["projectUpdate"]
}')
if [[ $UPDATE_RESPONSE == *"schedule"* ]]; then
    print_result 0 "Configuration des mises à jour réussie"
else
    print_result 1 "Échec de la configuration" "$UPDATE_RESPONSE"
fi

# Test 4: Création d'une vidéo milestone
echo -e "\n📋 Test de création d'une vidéo milestone..."
VIDEO_RESPONSE=$(curl -k -s -X POST "$API_URL/api/tiktok/projects/PROJECT_ID/milestone-video" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "milestone": "50% atteint",
  "template": "milestone"
}')
if [[ $VIDEO_RESPONSE == *"videoContent"* ]]; then
    print_result 0 "Création de la vidéo milestone réussie"
else
    print_result 1 "Échec de la création de la vidéo" "$VIDEO_RESPONSE"
fi

# Test 5: Récupération des analytics
echo -e "\n📋 Test de récupération des analytics TikTok..."
ANALYTICS_RESPONSE=$(curl -k -s "$API_URL/api/tiktok/projects/PROJECT_ID/analytics" \
-H "Authorization: Bearer $TOKEN")
if [[ $ANALYTICS_RESPONSE == *"videoPerformance"* ]]; then
    print_result 0 "Récupération des analytics réussie"
else
    print_result 1 "Échec de la récupération des analytics" "$ANALYTICS_RESPONSE"
fi

echo -e "\n✅ Tests de l'intégration TikTok terminés !"