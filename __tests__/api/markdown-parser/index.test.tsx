import { render, fireEvent, screen } from '@testing-library/react'
import parseMarkdown, { splitMarkdownContent } from '@/api/markdown-parser'
import md from './markdown.test.md'
import mdx from './markdown.test.mdx'
import '@testing-library/jest-dom'

test('Test md render', async () => {
  const parsed = await parseMarkdown(splitMarkdownContent(md).content, '.md')
  const rendered = render(parsed.page)
  expect(rendered.baseElement.innerHTML).toMatchSnapshot()
})

test('Test mdx render', async () => {
  const parsed = await parseMarkdown(splitMarkdownContent(mdx as unknown as string).content, '.mdx')
  render(parsed.page)

  const btn = screen.getByRole('button')
  fireEvent.click(btn)
  expect(btn).toHaveTextContent('1')
})