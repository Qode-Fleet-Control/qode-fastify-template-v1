# Fastify template

Provisioned from [`Qode-Fleet-Control/fleet-template-v1`](https://github.com/Qode-Fleet-Control/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows, `compose.yaml`) with a Fastify 5 app in ES modules from fastify-cli's generator: `@fastify/autoload` for `plugins/` and `routes/`, `@fastify/sensible`, `node:test` suite laid on top.

Listens on `0.0.0.0:$PORT` (default `3000`) and serves at the root (`/`) of its own hostname
(`https://<hash>.<FLEET_APP_DOMAIN>/`); the health check hits `/health`. In the container: `npm start` (`fastify start -l info app.js`).

## Origin

    npx fastify-cli@8.0.3 generate qode-fastify-template-v1 --esm

Generated 2026-10-05 with fastify-cli 8.0.3 (host Node v22.12.0 / npm 10.9.0).

## Run it

### On the fleet

The fleet clones the repo, injects `PORT` (and the workspace's `DATABASE_URL`, `REDIS_URL`, ...) and runs
`bin/run`, which uses the docker runtime from `fleet.conf`: `docker compose build`, then `docker compose up --remove-orphans` in the foreground.

### With docker

    PORT=3000 bin/run                  # what the fleet does
    docker compose up --build        # or plain compose

### Without docker

`FLEET_RUNTIME=process bin/run` runs the plain commands from `fleet.conf`:

| step | command |
|---|---|
| install | `npm install` |
| build | `(none)` |
| start | `npx fastify start -a 0.0.0.0 -p $PORT -l info app.js` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

See `docs/fleet-lifecycle.md` for the full contract.

## Deviations from the generator output

- Added `routes/health/index.js` (autoloaded at `GET /health` -> `{"status":"ok"}`) and `test/routes/health.test.js`.
- The image sets `FASTIFY_ADDRESS=0.0.0.0` (fastify-cli's `--address`) rather than relying on its docker auto-detection, which misses some container runtimes; fastify-cli reads `PORT` at runtime.
- `package-lock.json` added (`npm install --package-lock-only`) so the image build can use `npm ci`.
- Added the fleet files: `bin/` (lifecycle scripts), `fleet.conf`, `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.example`, `.github/workflows/`, `docs/fleet-lifecycle.md`; fleet entries (`.fleet/`, `*.log`, ...) prepended to `.gitignore`.

## Verified

**Not yet verified in docker.** On 2026-10-05 the shared docker host's disk stayed at 0-2 GB free for over 3 hours (held by other workloads), so the image was never built; `verify.sh` / `docker compose run` must still be run before this is trusted. `migrate.py audit`: READY. Without docker: `npm test` — 4 tests passed (incl. the new `/health` test).

---

# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
