import adjustToc from '@/api/markdown-parser/common/toc-adjust-plugin'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'


test('Toc adjust', async () => {
  const doc = `# h1
  
ee

## h2

eee
  `
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(adjustToc)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(doc)
  expect(String(parsed)).toMatchSnapshot()
})

test('No toc adjust', async () => {
  const doc = `## h1
  
ee

### h2

eee
  `
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(adjustToc)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(doc)
  expect(String(parsed)).toMatchSnapshot()
})