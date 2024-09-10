import type HtmlTagHandler from '@/api/markdown-parser/impl/md/HtmlTagHandler'
import type { Element, HTMLReactParserOptions } from 'html-react-parser'
import React from 'react'
import PreviewableImage from '@/components/PreviewableImage'

const imageHandler: HtmlTagHandler = {
  supportedTag: 'img',
  doCast(node: Element): ReturnType<Required<HTMLReactParserOptions>['replace']> {
    if (!node.attribs) {
      node.attribs = {
        'loading': 'lazy'
      }
      return
    }
    const src = node.attribs['src']
    const alt = node.attribs['alt'] ?? ''
    if (!src) {
      return
    }
    return React.createElement(PreviewableImage, { src, alt })
  }
}

export default imageHandler
