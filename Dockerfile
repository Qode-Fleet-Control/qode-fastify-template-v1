# Built by .github/workflows/deploy.yml (context ., file Dockerfile) and pushed
# to Artifact Registry. Adapted from the fleet's node stack pack.
#
# No build step: one stage installs production deps from the lockfile, the second
# copies them next to the source and runs the generated `npm start`
# (fastify start -l info app.js) as the image's non-root `node` user.
#
# fastify-cli reads PORT from the environment AT RUNTIME, and FASTIFY_ADDRESS (its
# `--address`) — set to 0.0.0.0 here so it listens on every interface rather than
# relying on its docker auto-detection, which misses some container runtimes.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime
ARG BUILD_ID=""
WORKDIR /app
ENV NODE_ENV=production PORT=3000 FASTIFY_ADDRESS=0.0.0.0 BUILD_ID=$BUILD_ID
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "start"]
