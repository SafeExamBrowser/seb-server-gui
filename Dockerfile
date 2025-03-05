# Stage 1: Build the Vue app
FROM node:22.2.0 as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .

# Inject environment variables for Vue.js
ARG VITE_SUB_PATH
RUN echo "VITE_SUB_PATH=$VITE_SUB_PATH" > .env

RUN npm run build

# Stage 2: Build the Express server
FROM node:22.2.0 as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
RUN npm install typescript
COPY server/ .
RUN npm run build

# Stage 3: Create the final image
FROM node:22.2.0-alpine
WORKDIR /app 
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./server/dist/views
COPY --from=client-builder /app/client/.env ./server/dist/views
COPY server/package*.json ./
RUN npm install

# Stage 4: Copy env-var bash script
COPY env.sh /app/env.sh
RUN chmod +x /app/env.sh

EXPOSE 3000

# Start the server
CMD ["/bin/sh", "-c", "./env.sh && node ./server/dist/app.js"]