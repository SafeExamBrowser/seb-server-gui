# Local backend

A local SEB Server, Screen Proctoring server and MariaDB for running the GUI against a
real backend on your machine. CI doesn't use it.

```bash
docker compose -f local-backend/docker-compose.yml up -d   # from the repo root
```

SEB Server listens on `localhost:8080`, Screen Proctoring on `localhost:8090`, MariaDB
on `localhost:3307`. Both servers use the `sprint-testing` images of the backend repos.
