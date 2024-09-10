import type React from 'react'
import type { TocItem } from '@/api/datasource/types/definitions'

export type ParsedMarkdown = {
  page: React.ReactNode
  toc: TocItem[]
}

export interface MarkdownParser {
  /**
   * 解析markdown
   */
  parse(markdown: string): Promise<ParsedMarkdown>
}