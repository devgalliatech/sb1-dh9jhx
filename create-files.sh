#!/bin/bash

# Création de la structure
mkdir -p api/src/{config,models}
mkdir -p nginx/conf.d
mkdir -p nginx/ssl
mkdir -p nginx/logs

# Création des fichiers de configuration
cat > docker-compose.yml << 'EOL'
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - api
    networks:
      - gallia_network

  api:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./api:/app
    environment:
      - NODE_ENV=production
    command: sh -c "npm install && npm start"
    networks:
      - gallia_network

networks:
  gallia_network:
    driver: bridge
EOL

cat > nginx/conf.d/default.conf << 'EOL'
server {
    listen 80;
    server_name api.galliatech.com;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.galliatech.com;

    # Configuration SSL
    ssl_certificate /etc/nginx/ssl/api.galliatech.com.crt;
    ssl_certificate_key /etc/nginx/ssl/api.galliatech.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Logs
    access_log /var/log/nginx/api_access.log;
    error_log /var/log/nginx/api_error.log;

    location / {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL

cat > api/package.json << 'EOL'
{
  "name": "galliatech-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "stripe": "^14.9.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOL

cat > api/src/index.js << 'EOL'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API GalliaTech opérationnelle' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
});
EOL

cat > api/.env.example << 'EOL'
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/galliatech
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=24h
STRIPE_SECRET_KEY=votre_cle_stripe_secrete
STRIPE_WEBHOOK_SECRET=votre_secret_webhook_stripe
EOL

cat > install-docker.sh << 'EOL'
#!/bin/bash

# Mise à jour du système
apt-get update
apt-get upgrade -y

# Installation des prérequis
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Ajout de la clé GPG officielle de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Configuration du repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installation de Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Installation de Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Démarrage de Docker
systemctl start docker
systemctl enable docker

# Vérification des installations
docker --version
docker-compose --version
EOL

cat > setup-ssl.sh << 'EOL'
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
systemctl stop nginx || true
systemctl stop docker || true

# Génération du certificat
certbot certonly --standalone -d api.galliatech.com

# Création du dossier pour les certificats
mkdir -p ~/galliatech/nginx/ssl

# Copie des certificats
cp /etc/letsencrypt/live/api.galliatech.com/fullchain.pem ~/galliatech/nginx/ssl/api.galliatech.com.crt
cp /etc/letsencrypt/live/api.galliatech.com/privkey.pem ~/galliatech/nginx/ssl/api.galliatech.com.key

# Ajustement des permissions
chmod 600 ~/galliatech/nginx/ssl/api.galliatech.com.key

echo "✅ Certificats SSL générés et configurés avec succès"
EOL

# Rendre les scripts exécutables
chmod +x install-docker.sh setup-ssl.sh

echo "✅ Tous les fichiers ont été créés avec succès"