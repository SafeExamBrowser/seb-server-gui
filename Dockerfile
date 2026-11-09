ARG NODE_VERSION=24.22.2

# Build client
FROM node:${NODE_VERSION} AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build server
FROM node:${NODE_VERSION} AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Install server runtime dependencies only (no build tooling), on the same
# base as the final image
FROM node:${NODE_VERSION}-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Create final image
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
ENV SERVE_CLIENT=true
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./server/dist/views
COPY --from=server-deps /app/server/node_modules ./node_modules

EXPOSE 3001

# Start server
CMD ["node", "./server/dist/index.js"]
