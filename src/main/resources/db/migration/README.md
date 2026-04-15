# Flyway Migrations

This directory is now the Spring-owned migration root.

Current transitional strategy:

- Flyway is enabled on startup.
- The application uses `baseline-on-migrate=true`.
- Existing non-empty copies of `indice_db` will be tagged at baseline version `0`.
- Fresh empty databases can now be built from `B1__spring_backend_baseline.sql`.
- Existing adopted databases with a schema history table will ignore baseline migrations.

Current committed baseline approach:

- `B1__spring_backend_baseline.sql` is the original Spring-owned subset baseline kept for historical continuity.
- `B18__spring_backend_baseline.sql` is the current cumulative baseline through `V18`.
- New empty databases should use the latest baseline migration and then only apply versioned migrations above that version.
- Existing adopted databases with a schema history table will ignore baseline migrations.
- The baseline keeps the core demo company, demo user, module catalog, and small org/HR seed needed for local development.

Migration naming rules for future SQL files:

- `V2__description.sql`
- `V3_1__description.sql`
- `R__description.sql` for repeatable migrations only when genuinely needed

Rules:

- Do not edit an already applied versioned migration.
- Do not make schema changes outside Flyway once a change is Spring-owned.
- Keep MySQL-specific SQL valid for direct execution in MySQL when possible.
- Treat committed baseline migrations as immutable after adoption.
- The next normal versioned migration should start at `V19__...`.
