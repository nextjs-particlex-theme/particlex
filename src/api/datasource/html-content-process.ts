import reactParse, { Element } from 'html-react-parser'
import type React from 'react'
import HtmlTagHandlerFactory from '@/api/datasource/HtmlTagHandlerFactory'


/**
 * 处理 html 博客内容
 */
export default function processPostContent(html: string): React.ReactNode {
  return reactParse(html, {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) {
        return 
      }
      if (domNode.tagName.includes('img')) {
        console.log()
      }
      return HtmlTagHandlerFactory.getInstance(domNode.tagName)?.doCast(domNode)
    }
  })
}

