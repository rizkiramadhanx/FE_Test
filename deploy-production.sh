#!/bin/bash

# Exit on error
set -e

# Step 2: Checkout the development branch
echo "Checking out the 'development' branch..."
git checkout development

# Step 3: Pull the latest changes from the 'development' branch
echo "Pulling the latest changes from 'development'..."
git pull origin development

# Step 4: Install dependencies
echo "Installing dependencies..."
npm install

# Step 5: Build the app
echo "Building the app..."
npm run build

# Step 6: Start the app with PM2 from the dist directory
echo "Starting the app with PM2 on port 5000..."
pm2 serve dist 3000 --spa --name "boilerplate-mantine-vite-prod"

# Optional: If you need to restart the PM2 process:
# echo "Restarting the app with PM2..."
# pm2 restart "boilerplate-mantine-vite-dev"

# Optional: To view all PM2 processes after deployment
# pm2 list

echo "Deployment completed successfully!"
