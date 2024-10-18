import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import type React from 'react'
import reactParse, { Element } from 'html-react-parser'
import HtmlTagHandlerFactory from '@/api/markdown-parser/impl/md/HtmlTagHandlerFactory'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import adjustToc from '@/api/markdown-parser/common/toc-adjust-plugin'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import generateHeadingId from '@/api/markdown-parser/common/generate-heading-id-plugin'


const markdownToHtml = async (markdownContent: string): Promise<string> => {
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(adjustToc)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(generateHeadingId)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdownContent)
  return String(parsed)
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
    const html = await markdownToHtml(markdown)
    const node = processPostContent(html)
    return Promise.resolve(node)
  }
} 

export default mdParser