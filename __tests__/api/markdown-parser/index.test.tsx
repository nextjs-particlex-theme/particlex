// import { render } from '@testing-library/react'
// import parseMarkdown, { splitMarkdownContent } from '@/api/markdown-parser'
// import md from './markdown.test.md'
// import mdx from './markdown.test.mdx'
// import '@testing-library/jest-dom'

// test('Test md render', async () => {
//   const parsed = await parseMarkdown(splitMarkdownContent(md).content, '.md')
//   const rendered = render(parsed)
//   expect(rendered.baseElement.innerHTML).toMatchSnapshot()
// })
//
// test('Test mdx render', async () => {
//   const parsed = await parseMarkdown(splitMarkdownContent(mdx as unknown as string).content, '.mdx')
//   const rendered = render(parsed)
//   expect(rendered.baseElement.innerHTML).toMatchSnapshot()
// })