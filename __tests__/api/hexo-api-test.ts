import { expect, test } from '@jest/globals'
import datasource from '@/api/datasource'

test('check getAllPosts type safety', async () => {
  // const config = await datasource.getConfig()

  const paths = await datasource.getAllResource()
  console.log(paths)
  // console.log(paths)
  // paths.forEach(val => {
  //   expect(Array.isArray(val.categories)).toBeTruthy()
  //   expect(Array.isArray(val.tags)).toBeTruthy()
  // })
})