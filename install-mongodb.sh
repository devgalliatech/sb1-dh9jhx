#!/bin/bash

# Mise à jour du système
apt-get update && apt-get upgrade -y

# Installation des dépendances nécessaires
apt-get install -y gnupg curl

# Ajout de la clé GPG de MongoDB
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Ajout du repository MongoDB
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian $(lsb_release -cs)/mongodb-org/7.0 main" | \
   tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Mise à jour des packages et installation de MongoDB
apt-get update
apt-get install -y mongodb-org

# Démarrage du service MongoDB
systemctl start mongod
systemctl enable mongod

# Vérification du statut
systemctl status mongod

echo "✅ MongoDB installé et démarré avec succès"