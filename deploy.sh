#!/bin/bash

# Update package.json
sed -i 's/"start": "nodemon bin\/www"/"start": "node bin\/www"/' package.json

# Create ecosystem.config.js for PM2
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "todo-list-backend",
    script: "bin/www",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
EOL

# Add this to .gitignore
echo "ecosystem.config.js" >> .gitignore
