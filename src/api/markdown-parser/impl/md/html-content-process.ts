import reactParse, { Element } from 'html-react-parser'
import type React from 'react'
import HtmlTagHandlerFactory from '@/api/markdown-parser/impl/md/HtmlTagHandlerFactory'


/**
 * 处理 html 博客内容
 */
export default function processPostContent(html: string): React.ReactNode {
  return reactParse(html, {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) {
        return 
      }
      return HtmlTagHandlerFactory.getInstance(domNode.tagName)?.doCast(domNode)
    }
  })
}

