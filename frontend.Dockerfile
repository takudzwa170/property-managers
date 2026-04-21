# Use official Node image
FROM node:20-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# Build app for production
RUN npm run build

# Expose port
EXPOSE 3000

# Start app in production mode
CMD ["npm", "start"]

