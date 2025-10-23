# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production=false --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --production=true --legacy-peer-deps

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]
