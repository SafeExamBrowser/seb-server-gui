# Build Vue app
FROM node:22.12.0 AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .

# Inject environment variables for Vue
ARG VITE_SUB_PATH
RUN echo "VITE_SUB_PATH=$VITE_SUB_PATH" > .env

RUN npm run build

# Build proxy
FROM node:22.12.0 AS proxy-builder
WORKDIR /app/proxy
COPY proxy/package*.json ./
RUN npm ci
COPY proxy/ .
RUN npm run build

# Create final image
FROM node:22.12.0-alpine
WORKDIR /app 
COPY --from=proxy-builder /app/proxy/dist ./proxy/dist
COPY --from=client-builder /app/client/dist ./proxy/dist/views
COPY --from=client-builder /app/client/.env ./proxy/dist/views
COPY proxy/package*.json ./
RUN npm ci

EXPOSE 3001

# Start proxy
CMD ["node", "./proxy/dist/index.js"]