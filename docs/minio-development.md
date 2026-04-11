# MinIO Development Setup

This repo uses MinIO for attendance-photo storage in development.

## Start MinIO

```bash
docker compose up -d minio minio-init
```

MinIO endpoints:

- API: `http://127.0.0.1:9000`
- Console: `http://127.0.0.1:9001`
- Username: `minioadmin`
- Password: `minioadmin`

The bootstrap step creates the private bucket:

- `indice-hr-attendance`
- `indice-hr-biometric`

and applies the browser CORS rules needed for presigned uploads from the local frontend.

## Face Service Networking

If you run the Python `face-service` through `docker compose` while Spring Boot runs directly on the host, do **not** leave Spring generating biometric download URLs with `127.0.0.1`.

The face-service container needs a host-reachable MinIO URL for the presigned biometric downloads used during enrollment and verification.

Recommended host-side Spring startup:

```bash
APP_STORAGE_MINIO_PUBLIC_ENDPOINT=http://host.docker.internal:9000 \
mvn spring-boot:run -Pminio
```

Then start MinIO and the face service:

```bash
docker compose up -d minio minio-init face-service
```

`compose.yaml` now adds the `host.docker.internal` host-gateway alias for the face-service container.

## Enable storage in Spring Boot

Local MinIO defaults now live in:

- [application-minio.properties](/home/arcturus/Desktop/indice_saas_spring/src/main/resources/application-minio.properties)

Recommended clean startup command:

```bash
mvn spring-boot:run -Pminio
```

Equivalent explicit profile command:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=minio
```

If the `minio` profile is not enabled, object storage stays disabled and attendance photo uploads will not be available.

## How phase 1 stores attendance photos

- Browser requests a presigned PUT URL from Spring Boot
- Browser uploads photo bytes directly to MinIO
- Browser submits the attendance event with the returned object key
- Spring Boot stores the object key in `hr_attendance_events.photo_url`
- Spring Boot returns short-lived signed GET URLs for attendance evidence preview
