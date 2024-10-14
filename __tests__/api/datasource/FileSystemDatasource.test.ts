import { glob } from 'glob'
import path from 'node:path'
import datasource from '@/api/datasource'

test('Test archive list', async () => {
  const files = glob.globSync('./**/*.{md,mdx}', { cwd: path.resolve(process.env.BLOG_PATH, process.env.BLOG_HOME_POST_DIRECTORY) })

  expect(files.length).toBeGreaterThan(0)

  expect((await datasource.getAllHomePosts()).map(v => v.visitPath))
    .toStrictEqual(files.map(v => datasource.resolvePostWebPath(v)))
})
