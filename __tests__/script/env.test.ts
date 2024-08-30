/**
 * Test /script/env.mjs
 */
import env from '../../scripts/env.mjs'
import { expect, test } from '@jest/globals'


test('Test env order', async () => {
  // @ts-ignore
  process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL = 'hello world'
  await env()
  expect(process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL).toBe('hello world')
})
