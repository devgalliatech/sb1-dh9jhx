#!/bin/bash

# Création du fichier de configuration MongoDB
cat > /etc/mongod.conf << 'EOL'
security:
  authorization: enabled

systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
EOL

# Redémarrage du service MongoDB
systemctl restart mongod

echo "✅ Sécurité MongoDB configurée avec succès"