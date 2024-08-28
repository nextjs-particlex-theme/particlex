import { expect, test } from '@jest/globals'
import markdown from './markdown.test.md'
import badHeadingMarkdown from './bad-heading.test.md'
import { parseMarkdownContent } from '@/api/datasource/markdown-parser'

test('Test markdown parse', () => {
  const post = parseMarkdownContent(markdown)
  expect(post).toMatchSnapshot()
})


test('Test bad heading', () => {
  const post = parseMarkdownContent(badHeadingMarkdown)
  expect(post).toMatchSnapshot()
})