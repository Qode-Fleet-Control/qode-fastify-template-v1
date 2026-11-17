import fp from 'fastify-plugin'

// KEEP THIS: one log line per request (status + duration) is what the workspace Monitoring tab charts.
//
// Writes ONE JSON line to stdout per finished request (every route, 404s and health checks
// included; the platform filters the kubelet's probes itself):
//   {"status":200,"durationMs":3.2,"method":"GET","path":"/health","ua":"curl/8.5.0"}
// Written directly, not through pino: pino's "request completed" line uses `statusCode`,
// which is not the Monitoring contract. Never logs bodies, cookies, headers other than the
// user agent, or the query string.
export default fp(async function (fastify) {
  fastify.addHook('onResponse', async (request, reply) => {
    const url = request.url || ''
    const q = url.indexOf('?')
    const line = {
      status: reply.statusCode,
      durationMs: Math.round(reply.elapsedTime * 10) / 10,
      method: request.method,
      path: (q === -1 ? url : url.slice(0, q)).slice(0, 512),
      ua: String(request.headers['user-agent'] || '').slice(0, 256)
    }
    process.stdout.write(JSON.stringify(line) + '\n')
  })
}, { name: 'request-log' })
