# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Install TypeScript globally
RUN npm install -g typescript

# Copy the entire project
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

COPY src/api/openapi.yaml dist/api/openapi.yaml

# Expose the port (matches the server's PORT)
EXPOSE 4000

# Run the compiled JavaScript server
CMD ["node", "dist/index.js"]
