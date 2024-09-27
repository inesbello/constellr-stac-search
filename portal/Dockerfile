# Use Node.js 16 LTS image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend (assuming this is a React app)
RUN npm run build

# Expose port 3000 for the frontend
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]
