# seb-server-gui

GUI component for Safe Exam Browser Server project.

This is a sub-project of SEB Server. For full usage and installation, please visit the [SEB Server page](https://github.com/SafeExamBrowser/seb-server)

## Overview

**This project is still under development and has not yet an official release or release data.**

This project consists of two parts. A client component and a server component. The server contains no businesses logic but serves as a lightweight api-gateway between the client and the [SEB-Server](https://github.com/SafeExamBrowser/seb-server). The easiest way to build and deploy the project is via docker.

# Development Setup

## Intro

If you're just working on the frontend part (SEB Server GUI), this is the easiest way to have a working environment. This pulls the backend services (mariadb, seb-server and sps-webservice) from existing images

## Setup docker containers

1. Run `docker-compose up -d`

## Setup the client

1. `cd client`
1. Start virtual node env: `nvm use`
1. Install dependencies: `npm ci`
1. Copy the example `.env` file and adapt it to your needs: `cp .env.example .env`
1. Start the client: `npm run dev`

## Setup the server

1. See `README.md` in `/server`

## Confirm setup worked

1. Visit http://localhost:8082 and login to confirm that the full setup works

## Install the pre-commit hook

1. Run `cd client && nvm use && npm run prepare`
1. Run `git config core.hooksPath` and verify, that the `hooksPath` was correctly set to `./client/.husky/_`

## Find Login info

- The setup comes with a static demo account: super-admin / admin
- Alternatively you can run `docker-compose logs seb-server | grep "SEB Server initial admin-account"` to see the admin user and password that was generated for your instance of seb-server
