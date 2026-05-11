#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "--- Actualizando sistema e instalando dependencias ---"
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y python3-pip python3-venv nginx postgresql postgresql-contrib curl git

# 1. Configurar PostgreSQL
sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'mypassword';" || true
sudo -u postgres psql -c "CREATE DATABASE tasks_db OWNER myuser;" || true

# 2. Instalar Node.js 22 (LTS) - Necesario para Vite 8+
echo "--- Instalando Node.js 22 ---"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Forzar actualización de npm y PM2
sudo npm install -g npm@latest
sudo npm install -g pm2 || true

echo "--- Configurando Nginx ---"
cat <<EOF | sudo tee /etc/nginx/sites-available/default
server {
    listen 80;
    server_name _;

    location / {
        root /home/ubuntu/app/aws-cloud/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location ~ ^/(tasks|docs|openapi.json|redoc) {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Permisos críticos para que Nginx pueda leer el build del usuario ubuntu
sudo chmod -R 755 /home/ubuntu

echo "--- Reiniciando Nginx ---"
sudo systemctl restart nginx