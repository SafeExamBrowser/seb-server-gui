# Server

## Description / Features

- Exposes a lightweight backend gateway for the SEB Server GUI (adds HTTP basic auth headers where needed)
- Validates required environment variables at startup and exits early if config is invalid
- Proxies `/api/*` requests to either the SEB server or the proctor server
- Optionally serves the built client as static files when `SERVE_CLIENT=true` (this is used for prod)

## Setup

1. Start virtual node env: `nvm use`
1. Install dependencies: `npm ci`
1. Copy the example `.env` file and adapt it to your needs: `cp .env.example .env`

## Dev

Start server: `npm run dev`
