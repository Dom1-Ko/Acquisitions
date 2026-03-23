# 1. Base Setup
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# 2. Development Stage
FROM base AS development
# Install dev dependencies
RUN npm ci && npm cache clean --force
# No COPY . . needed here because docker-compose volumes handle it
EXPOSE 5173
CMD ["npm", "run", "dev"]

# 3. Production Stage
FROM base AS production
# Install only prod dependencies
RUN npm ci --only=production && npm cache clean --force

# Security: Create user BEFORE copying code
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy source code and set permissions in ONE step
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 5173

# Realistic start period for DB connections
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

CMD ["npm", "start"]
