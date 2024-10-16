import type React from 'react'

export type ParsedMarkdown = React.ReactNode

export interface MarkdownParser {
  /**
   * 解析markdown
   */
  parse(markdown: string): Promise<ParsedMarkdown>
}