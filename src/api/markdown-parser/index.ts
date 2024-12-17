import mdParser from '@/api/markdown-parser/impl/md/MdParser'
import mdxParser from '@/api/markdown-parser/impl/mdx/MdxParser'
import type { ParsedMarkdown } from '@/api/markdown-parser/types'

/**
 * 解析markdown文本内容
 * @param markdown markdown 文本内容
 * @param identifier 标识符，md或mdx
 */
const parseMarkdown = (markdown: string, identifier: string): Promise<ParsedMarkdown> => {
  if (identifier.endsWith('.md')) {
    return mdParser.parse(markdown)
  } else if (identifier.endsWith('.mdx')) {
    // TODO error handle.
    return mdxParser.parse(markdown)
  } else {
    throw new Error('Unknown file.')
  }
}

export type Markdown = {
  metadata: {
    title?: string
    date?: string
    categories?: string | string[]
    tags?: string | string[]
    seo?: {
      title?: string
      description?: string
      keywords?: string | string[]
    }
  }
  content: string
}


export default parseMarkdown
