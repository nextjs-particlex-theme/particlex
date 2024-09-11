import { expect, test } from '@jest/globals'
import markdown from './markdown.test.md'
import badHeadingMarkdown from './bad-heading.test.md'
import generateTocByMarkdown from '@/api/markdown-parser/common-toc-generator'

test('Test toc parse', () => {
  const toc = generateTocByMarkdown(markdown)
  expect(toc).toMatchSnapshot()
})


test('Test bad heading generate', () => {
  const toc = generateTocByMarkdown(badHeadingMarkdown)
  expect(toc).toMatchSnapshot()
})