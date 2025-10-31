# PawSpot

Monorepo for the PawSpot application containing web and API services and an admin UI.

This README explains how to get the project running locally, the order to start services, and common commands. The examples below include both PowerShell (Windows) and POSIX shell (macOS / Linux) variants. Commands that are identical across environments are shown once (typically under `bash`); where a command differs you'll see both forms.

## Prerequisites

- Node.js (16+ recommended)
- pnpm (matching the repo's package manager; e.g. pnpm@10+)
- Docker & Docker Compose (for the Postgres database)

Ensure `pnpm` is available in your shell. To check (POSIX / PowerShell both support these):

```bash
pnpm -v
node -v
docker -v
docker-compose -v
```

If you don't have `pnpm` installed globally, install it with:

POSIX (macOS / Linux):

```bash
npm install -g pnpm
```

PowerShell (Windows):

```powershell
npm install -g pnpm
```

## Repository layout (short)

- `apps/web` - public-facing frontend (Nuxt)
- `apps/admin` - admin UI (Nuxt)
- `apps/api` - NestJS backend API
- `packages/` - shared packages (contracts, logger, db schema)

## Environment

Copy the example env files where needed (each sub-project may have its own `env.example`). A top-level `env.example` is provided.

POSIX (macOS / Linux):

```bash
cp ./env.example .env
```

PowerShell (Windows):

```powershell
Copy-Item -Path .\env.example -Destination .env
```

Adjust environment variables for `apps/api` and `db` as required (database URL, ports, secrets).

## Database (Postgres) - using Docker Compose

Start PostgreSQL:

```bash
pnpm run db:up
```

View logs:

```bash
pnpm run db:logs
```

Stop and remove the DB container:

```bash
pnpm run db:down
```

Apply Prisma migrations and generate client (from the repo root):

```bash
pnpm run db:migrate
pnpm run db:generate
```

If you need a reset (development only):

```bash
pnpm run db:reset
```

## Development — order to run services

It's important to start services in this order so that the backend and database are available before frontends try to connect.

1. Start the database (Postgres):

```bash
pnpm run db:up
```

2. (Optional) Initialize DB schema / generate Prisma client:

```bash
pnpm run db:migrate
pnpm run db:generate
```

3. Start the API (NestJS backend):

```bash
pnpm run start:api
```

4. Start the Web frontend:

```bash
pnpm run start:web
```

5. Start the Admin UI (in a separate terminal):

```bash
pnpm run start:admin
```

Tip: you can start all three (web, api, admin) concurrently from the repo root, but the exact behavior depends on your shell. The repo includes a top-level `start` script that attempts to run them in parallel; how backgrounding and process handling works varies between bash, zsh, PowerShell and CMD.

Recommended options:

- Start each service in its own terminal for clear logs (recommended).
- Or, run the top-level script (may work in many environments):

```bash
pnpm run start
```


## Other useful scripts

- `pnpm run build` — builds all packages/apps (runs recursive build)
- `pnpm run test` — runs tests for packages/apps (runs recursive test)
- `pnpm run db:studio` — open Prisma Studio for DB inspection

Refer to the root `package.json` for the full list of scripts.

## Troubleshooting

- If frontends fail to connect to the API, confirm the API URL in the frontend environment files and that the API is running.
- If Prisma migrations fail, ensure the Postgres container is up and the connection string is correct.
- If you see `pnpm` errors about peer deps, run `pnpm install` in the affected package (for example `pnpm --filter apps/api install`).

## Contributing

Open pull requests against `master`. Follow existing code style and lint rules in each package. Many packages include `tsconfig` and ESLint configs — run the corresponding package `build` or `lint` script before submitting a PR.

## Next steps / notes

- Check each `apps/*/README.md` or `package.json` for additional local dev commands or environment variables specific to that app.
- Consider adding a single `Makefile` or `justfile` to standardize common sequences.

---

If you'd like, I can also:
- add examples of expected env variables for `apps/api` and `db` to the root `env.example`;
- create small PowerShell helper scripts to start each service in a new window for easier concurrent development.

Completion: README created and includes ordered command steps for PowerShell users.
