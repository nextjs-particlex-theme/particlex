import { getAllPosts } from '@/api/hexo-api'
import {expect, test} from '@jest/globals'

test('check getAllPosts type safety', async () => {
  const paths = await getAllPosts()
  console.log(paths)
  paths.forEach(val => {
    expect(Array.isArray(val.categories)).toBeTruthy()
    expect(Array.isArray(val.tags)).toBeTruthy()
  })
})