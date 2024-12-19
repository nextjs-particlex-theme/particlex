import { render } from '@testing-library/react'
import parseMarkdown from '@/api/markdown-parser'
import md from './markdown.test.md'
import mdx from './markdown.test.mdx'
import '@testing-library/jest-dom'

test('Test md render', async () => {
  const parsed = await parseMarkdown(md, '.md')
  const rendered = render(parsed)
  expect(rendered.baseElement.innerHTML).toMatchSnapshot()
})

test('Test mdx render', async () => {
  const parsed = await parseMarkdown((mdx as unknown) as string, '.mdx')
  const rendered = render(parsed)
  expect(rendered.baseElement.innerHTML).toMatchSnapshot()
})