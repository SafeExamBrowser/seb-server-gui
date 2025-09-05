# Development Setup

## Intro

If you're just working on the frontend part (SEB Server GUI), this is the easiest way to have a working environment. This pulls the backend services (mariadb, seb-server and sps-webservice) from existing images. The frontend services (fe-server and fe-client) are built from the local code of this repository.

## Follow these steps

1. Run `docker-compose up -d`
1. Run `docker-compose logs seb-server | grep "SEB Server initial admin-account"` to see the admin user and password that was generated for your instance of seb-server (write this down, you will need it later)
1. Visit http://localhost:8082 and login to confirm that the full setup works
