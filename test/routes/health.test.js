import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'

test('health route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/health'
  })
  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(JSON.parse(res.payload), { status: 'ok' })
})
