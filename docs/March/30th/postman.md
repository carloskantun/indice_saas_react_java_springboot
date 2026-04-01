# Postman Guide

Files:

- [`postman/indice-erp-api.postman_collection.json`](../postman/indice-erp-api.postman_collection.json)
- [`postman/indice-erp-api.local.postman_environment.json`](../postman/indice-erp-api.local.postman_environment.json)

## Import

1. Import the collection
2. Import the environment
3. Select the local environment

## Base URL

- `http://127.0.0.1:8082`

## Main flow

1. `POST /api/v1/auth/login`
2. `GET /api/v1/auth/me`
3. run any other route
