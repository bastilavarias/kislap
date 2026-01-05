# Use Node.js 22.11.0
FROM node:22.11.0

# Set working directory inside container
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Default command: run in dev mode
CMD ["npm", "run", "dev"]