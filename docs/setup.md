# Setup Guide

## Requirements

- Java 21
- Docker
- MySQL container `indice-mysql`

## Verify MySQL

```bash
docker ps
docker exec indice-mysql mysql -u indice_user -pindice_pass -e "SELECT 1" indice_db
```

## Run backend

```bash
cd ~/Desktop/indice_saas_spring
./mvnw spring-boot:run
```

Default URL:

- `http://127.0.0.1:8082`

## Quick checks

Open:

- `http://127.0.0.1:8082/`
- `http://127.0.0.1:8082/api/v1/health`

## Demo credentials

- email: `demo@example.com`
- password: `demo123`

## Frontend

In the React frontend:

```env
VITE_BACKEND_URL=http://127.0.0.1:8082
VITE_API_BASE_URL=
```

