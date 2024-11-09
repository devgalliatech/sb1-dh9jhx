#!/bin/bash

# Mise à jour du système
apt-get update
apt-get upgrade -y

# Installation de PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Démarrage et activation du service
systemctl start postgresql
systemctl enable postgresql

# Création de l'utilisateur et de la base de données
sudo -u postgres psql << EOF
CREATE USER galliatech WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE galliatech OWNER galliatech;
\q
EOF

echo "✅ PostgreSQL installé et configuré avec succès"