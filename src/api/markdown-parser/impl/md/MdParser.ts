import type { MarkdownParser, ParsedMarkdown } from '@/api/markdown-parser/types'
import showdown from 'showdown'
import type React from 'react'
import reactParse, { Element } from 'html-react-parser'
import HtmlTagHandlerFactory from '@/api/markdown-parser/impl/md/HtmlTagHandlerFactory'
import type { TocItem } from '@/api/datasource/types/definitions'
import { JSDOM } from 'jsdom'

showdown.setFlavor('github')

const LEVEL_MAPPING: Record<string, number> = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
}

type WrappedTocItem = {
  item: TocItem
  actualLevel: number
}

const markdownToHtml = (markdownContent: string): string => {
  const sd = new showdown.Converter({
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    headerLevelStart: 1,
    rawHeaderId: true
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

function generateShallowToc(html?: string): TocItem[] {
  if (!html) {
    return []
  }
  const dom = new JSDOM(html, { contentType: 'text/html' })

  const root = dom.window.document.body

  let parentStack: WrappedTocItem[] = [{ item: { title: 'FakeRoot', child: [], anchor: '#' }, actualLevel: -1 }]

  root.childNodes.forEach(v => {
    const currentLevel = LEVEL_MAPPING[v.nodeName]
    if (currentLevel === undefined) {
      return
    }
    const heading = v as HTMLHeadingElement
    const data = {
      title: heading.innerHTML,
      anchor: '#' + heading.getAttribute('id')
    }
    const item: WrappedTocItem = {
      item: {
        ...data,
        child: []
      },
      actualLevel: currentLevel,
    }
    for (let i = parentStack.length - 1; i >= 0; --i) {
      const cur = parentStack[i]
      if (cur.actualLevel < item.actualLevel) {
        // remaining child
        cur.item.child.push(item.item)
        parentStack.push(item)
        break
      } else {
        parentStack.pop()
      }
    }
  })
  return parentStack[0].item.child
}


const mdParser: MarkdownParser = {
  parse(markdown: string): Promise<ParsedMarkdown> {
    const html = markdownToHtml(markdown)
    const node = processPostContent(html)
    return Promise.resolve({
      page: node,
      toc: generateShallowToc(html)
    })
  }
} 

export default mdParser