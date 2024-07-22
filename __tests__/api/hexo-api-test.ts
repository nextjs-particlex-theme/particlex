import { expect, test } from '@jest/globals'
import datasource from '@/api/datasource'

test('check getAllPosts type safety', async () => {
  const paths = await datasource.pagePosts()
  console.log(paths)
  paths.forEach(val => {
    expect(Array.isArray(val.categories)).toBeTruthy()
    expect(Array.isArray(val.tags)).toBeTruthy()
  })
})