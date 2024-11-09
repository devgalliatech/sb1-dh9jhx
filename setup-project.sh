#!/bin/bash

# Création des répertoires nécessaires
mkdir -p ~/galliatech/nginx/conf.d
mkdir -p ~/galliatech/nginx/ssl
mkdir -p ~/galliatech/nginx/logs
mkdir -p ~/galliatech/api/src

# Copie des fichiers de configuration
cat > ~/galliatech/docker-compose.yml << 'EOL'
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

cat > ~/galliatech/nginx/conf.d/default.conf << 'EOL'
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

cat > ~/galliatech/api/package.json << 'EOL'
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
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOL

cat > ~/galliatech/api/src/index.js << 'EOL'
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

# Création du fichier .env
cat > ~/galliatech/api/.env << 'EOL'
PORT=3000
NODE_ENV=production
EOL

echo "Configuration du projet terminée !"