import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import MdxCodeBlock from '@/api/markdown-parser/impl/mdx/components/MdxCodeBlock'
import MdxImage from '@/api/markdown-parser/impl/mdx/components/MdxImage'
import MdxBlockQuote from '@/api/markdown-parser/impl/mdx/components/MdxBlockQuote'
import PintoraDiagram from '@/api/markdown-parser/impl/mdx/components/PintoraDiagram'
import ListPage from '@/api/markdown-parser/impl/mdx/components/ListPage'
import { createMdxParser } from '@blog-helper/react-mdx'


const mdxParser0 = createMdxParser({
  components: {
    pre: MdxCodeBlock,
    img: MdxImage,
    blockquote: MdxBlockQuote,
    PintoraDiagram,
    ListPage,
  }
})


const mdxParser: MarkdownParser = {
  async parse(markdown: string): Promise<ParsedMarkdown> {
    return mdxParser0.parse(markdown)
  }
}

export default mdxParser
