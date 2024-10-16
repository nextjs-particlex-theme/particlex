import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import showdown from 'showdown'
import type React from 'react'
import reactParse, { Element } from 'html-react-parser'
import HtmlTagHandlerFactory from '@/api/markdown-parser/impl/md/HtmlTagHandlerFactory'

showdown.setFlavor('github')

const markdownToHtml = (markdownContent: string): string => {
  const sd = new showdown.Converter({
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    headerLevelStart: 1,
    rawHeaderId: true,
  })
  return sd.makeHtml(markdownContent)
}

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
    const html = markdownToHtml(markdown)
    const node = processPostContent(html)
    return Promise.resolve(node)
  }
} 

export default mdParser