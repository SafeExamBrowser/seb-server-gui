# Build client
FROM node:22.12.0 AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build server
FROM node:22.12.0 AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Create final image
FROM node:22.12.0-alpine
WORKDIR /app 
ENV SERVE_CLIENT=true
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./server/dist/views
COPY --from=server-builder /app/server/node_modules ./node_modules

EXPOSE 3001

# Start server
CMD ["node", "./server/dist/index.js"]