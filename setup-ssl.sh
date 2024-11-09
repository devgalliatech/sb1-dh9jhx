#!/bin/bash

# Vérification que l'utilisateur est root
if [ "$EUID" -ne 0 ]; then 
  echo "Ce script doit être exécuté en tant que root (avec sudo)"
  exit 1
fi

# Installation de Certbot
apt-get update
apt-get install -y certbot

# Arrêt temporaire de tout service sur le port 80
docker-compose down

# Génération du certificat
certbot certonly --standalone -d api.galliatech.com --agree-tos --email admin@galliatech.com --non-interactive

# Création du dossier pour les certificats
mkdir -p ~/galliatech/nginx/ssl

# Copie des certificats
cp /etc/letsencrypt/live/api.galliatech.com/fullchain.pem ~/galliatech/nginx/ssl/api.galliatech.com.crt
cp /etc/letsencrypt/live/api.galliatech.com/privkey.pem ~/galliatech/nginx/ssl/api.galliatech.com.key

# Ajustement des permissions
chmod 600 ~/galliatech/nginx/ssl/api.galliatech.com.key

# Redémarrage des services
cd ~/galliatech && docker-compose up -d

# Configuration du renouvellement automatique
(crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet --post-hook 'cp /etc/letsencrypt/live/api.galliatech.com/fullchain.pem ~/galliatech/nginx/ssl/api.galliatech.com.crt && cp /etc/letsencrypt/live/api.galliatech.com/privkey.pem ~/galliatech/nginx/ssl/api.galliatech.com.key && cd ~/galliatech && docker-compose restart nginx'") | crontab -

echo "✅ Certificats SSL générés et configurés avec succès"
echo "✅ Renouvellement automatique configuré (mensuel)"