import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import React from 'react'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import os from 'node:os'
import MdxCodeBlock from '@/api/markdown-parser/impl/mdx/components/MdxCodeBlock'
import MdxImage from '@/api/markdown-parser/impl/mdx/components/MdxImage'
import MdxBlockQuote from '@/api/markdown-parser/impl/mdx/components/MdxBlockQuote'
import generateTocByMarkdown from '@/api/markdown-parser/common-toc-generator'
import createCommonHeadingWithId from '@/api/markdown-parser/impl/mdx/components/CommonHeadingWithId'

const components = {
  pre: MdxCodeBlock,
  img: MdxImage,
  blockquote: MdxBlockQuote,
  h1: createCommonHeadingWithId('h1'),
  h2: createCommonHeadingWithId('h2'),
  h3: createCommonHeadingWithId('h3'),
  h4: createCommonHeadingWithId('h4'),
  h5: createCommonHeadingWithId('h5')
}

async function parseMarkdownContent0(content: string): Promise<React.ReactNode> {
  const code = String(
    await compile(content, { outputFormat: 'function-body' })
  )
  // @ts-ignore
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  // Render the MDX content, supplying the ClientComponent as a component
  return <MDXContent components={components} />
}

type ParseError = Error & {
  line: number
  name: string
  column: number
  place: {
    line: number
    column: number
    offset: number
  }
}

function isParseAeeror(err: unknown): err is ParseError {
  if (!err || !(typeof err === 'object')) {
    return false
  }
  const errObj = err as Partial<ParseError>
  return !!errObj.column && !!errObj.line && !!errObj.name && !!errObj.place
}

function takeAboveLines(self: string[], lines: string[], startLine: number, lineCnt: number) {
  let cnt = Math.min(startLine, lineCnt - 1)

  for (let i = startLine - cnt; i <= startLine; i++) {
    self.push(` ${i.toString(10).padStart(4, ' ')} | ${lines[i]}`)
  }
}

/**
 * 处理 html 博客内容
 */
async function parseMarkdownContent(content: string): Promise<React.ReactNode> {
  try {
    return await parseMarkdownContent0(content)
  } catch (e) {
    if (!isParseAeeror(e)) {
      return Promise.reject(e)
    }
    // indicate where is wrong.
    const lines = content.split(os.EOL)
    const message = ['Failed to parse markdown content:']
    const programLine = e.line - 1

    message.push('')
    takeAboveLines(message, lines, programLine, 4)

    message.push('        ' + (new Array(e.column - 1).join(' ')) + '^')
    message.push('\t' + e.message)

    return Promise.reject(new Error(message.join(os.EOL), { cause: e }))
  }
}


const mdxParser: MarkdownParser = {
  async parse(markdown: string): Promise<ParsedMarkdown> {
    let node = await parseMarkdownContent(markdown)

    return {
      toc: generateTocByMarkdown(markdown),
      page: node
    }
  }
}

export default mdxParser
