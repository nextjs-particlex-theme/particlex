import type HtmlTagHandler from '@/api/markdown-parser/impl/md/HtmlTagHandler'
import type { HTMLReactParserOptions } from 'html-react-parser'
import { Element, Text } from 'html-react-parser'
import React from 'react'
import PartialCodeBlock from '@/api/markdown-parser/components/PartialCodeBlock'


const preHandler: HtmlTagHandler = {
  supportedTag: 'pre',
  doCast(domNode: Element): ReturnType<Required<HTMLReactParserOptions>['replace']> {
    if (domNode.children.length !== 1) {
      throw new Error('Unexpected child data, expected only one child: ' + domNode)
    }
    const ele = domNode.children[0]
    if (!(ele instanceof Element)) {
      return
    }
    const text = ele.childNodes[0]
    if (text instanceof Text) {
      return React.createElement(PartialCodeBlock, { html: text.data, codeBlockClassname: ele.attribs['class'] })
    }
  }
}

export default preHandler
