# Production Dockerfile for AgriSmart Platform
FROM node:20-alpine

WORKDIR /app

# Create necessary directories and adjust permissions
RUN mkdir -p /app/backend/data && chown -R node:node /app

# Copy application manifest and source code
COPY --chown=node:node package.json ./
COPY --chown=node:node backend ./backend
COPY --chown=node:node frontend ./frontend

ENV PORT=3000 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE 3000

# Docker healthcheck probe using the built-in health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Run container as non-root user
USER node

CMD ["node", "backend/server.js"]
