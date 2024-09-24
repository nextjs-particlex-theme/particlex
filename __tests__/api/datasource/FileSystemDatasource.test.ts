import { glob } from 'glob'
import path from 'node:path'
import datasource from '@/api/datasource'

test('Test archive list', async () => {
  const files = glob.globSync(path.join(process.env.BLOG_PATH, process.env.BLOG_HOME_POST_DIRECTORY, '/**/*.{md,mdx}'))

  expect((await datasource.getAllHomePosts()).map(v => v.visitPath))
    .toStrictEqual(files.map(v => datasource.resolvePostWebPath(v)))
})
