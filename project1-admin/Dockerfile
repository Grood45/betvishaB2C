# Stage 1: Build the application using a Node.js base image
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Use a lightweight Nginx image to serve the build output
FROM nginx:alpine

# Copy built files from the previous stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default port for Nginx)
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

