// Liveness probe for the fleet (fleet.conf HEALTH_PATH). @fastify/autoload mounts
// this folder at /health.
export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { status: 'ok' }
  })
}
