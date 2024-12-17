import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import type React from 'react'
import reactParse, { Element } from 'html-react-parser'
import HtmlTagHandlerFactory from '@/api/markdown-parser/impl/md/HtmlTagHandlerFactory'
import { createMdParser } from '../../../../../../blog-datasource/blog-helper'


const markdownParser = createMdParser()

function processPostContent(html: string): React.ReactNode {
  return reactParse(html, {

    replace: (domNode) => {
      if (!(domNode instanceof Element)) {
        return
      }
      return HtmlTagHandlerFactory.getInstance(domNode.tagName)?.doCast(domNode)
    }
  })
}


const mdParser: MarkdownParser = {
  async parse(markdown: string): Promise<ParsedMarkdown> {
    const html = await markdownParser.parse(markdown)
    const node = processPostContent(html)
    return Promise.resolve(node)
  }
} 

export default mdParser