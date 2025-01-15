# Deployment Instructions

## Initial Server Setup (Run these commands on your GCP VM)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install pm2 -g

# Install Git
sudo apt install git -y

# Create app directory
mkdir -p /var/www/todo-list-backend
cd /var/www/todo-list-backend

# Clone your repository
git clone [YOUR_REPO_URL] .

# Install dependencies
npm install --production

# Setup PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/todo-list-backend

# Add this configuration:
# server {
#     listen 80;
#     server_name your-domain.com;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# Enable the site
sudo ln -s /etc/nginx/sites-available/todo-list-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Nginx Setup

```bash
# Install Nginx
sudo apt install nginx -y

# Remove default nginx site config
sudo rm /etc/nginx/sites-enabled/default

# Copy our nginx config
sudo cp nginx.conf /etc/nginx/sites-available/todo-list-backend

# Create symlink
sudo ln -s /etc/nginx/sites-available/todo-list-backend /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test is successful, restart nginx
sudo systemctl restart nginx

# Make sure nginx starts on boot
sudo systemctl enable nginx
```

## SSL Setup (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL Certificate (replace example.com with your domain)
sudo certbot --nginx -d example.com

# Certbot will automatically modify nginx config and enable HTTPS
```

## Environment Variables
Create a `.env` file in the root directory with these variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Updating the Application
To update the application when you have new changes:
```bash
cd /var/www/todo-list-backend
git pull
npm install --production
pm2 restart todo-list-backend
```
