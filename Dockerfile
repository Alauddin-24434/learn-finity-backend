# Use official lightweight Node.js 18 alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if exists) first for caching dependencies
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript project
RUN pnpm run build

# Expose port your app listens on
EXPOSE 5000

# Start the app in production mode
CMD ["pnpm", "run", "prod"]
