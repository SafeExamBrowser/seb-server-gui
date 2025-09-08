# seb-server-gui

GUI component for Safe Exam Browser Server project.

This is a sub-project of SEB Server. For full usage and installation, please visit the [SEB Server page](https://github.com/SafeExamBrowser/seb-server)

## Overview

**This project is still under development and has not yet an official release or release data.**

This project consists of two parts. A client component and a server component. The server contains no businesses logic but serves as a lightweight api-gateway between the client and the [SEB-Server](https://github.com/SafeExamBrowser/seb-server). The easiest way to build and deploy the project is via docker. 


### Client

The client uses the following technologies:

#### [VueJs Version 3.4.*](https://vuejs.org/)
 - Composition API and Script Setup Syntax
 - Typescript
 - [Vuetify](https://vuetifyjs.com/en/) as the componenet framework

### Server

The server uses the following technologies:

#### [ExpressJs Version 4.19.*](https://expressjs.com/)
 - Typescript
 - Axios as API-Request library


# Development Setup

## Intro

If you're just working on the frontend part (SEB Server GUI), this is the easiest way to have a working environment. This pulls the backend services (mariadb, seb-server and sps-webservice) from existing images. The frontend services (fe-server and fe-client) are built from the local code of this repository.

## Follow these steps

1. Run `docker-compose up -d`
2. The setup comes with demo data and you should be able to login with super-admin / admin
1. Alternatively you can run `docker-compose logs seb-server | grep "SEB Server initial admin-account"` to see the admin user and password that was generated for your instance of seb-server (write this down, you will need it later)
1. Visit http://localhost:8082 and login to confirm that the full setup works
