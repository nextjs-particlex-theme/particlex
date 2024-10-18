import type HtmlTagHandler from '@/api/markdown-parser/impl/md/HtmlTagHandler'
import type { Element, HTMLReactParserOptions } from 'html-react-parser'
import { domToReact, Text } from 'html-react-parser'
import GithubBlockquote, { SUPPORTED_TYPE } from '@/api/markdown-parser/components/GithubBlockquote'
import React from 'react'
import type { DOMNode } from 'html-dom-parser'
import os from "node:os";

const TYPE_SEARCH_REGX = /^\[!(?<type>[A-Z]+)]/



/**
 * 尝试将 BlockCode 转换成 github 格式的代码块
 */
const blockQuoteHandler: HtmlTagHandler = {
  supportedTag: 'blockquote',
  doCast(node: Element): ReturnType<Required<HTMLReactParserOptions>['replace']> {
    if (node.nodeType !== 1 || !node.childNodes || node.childNodes.length < 1 ) {
      return
    }
    const nested = node.childNodes[1] as Element
    if (nested.nodeType !== 1 || !nested.childNodes || nested.childNodes.length == 0) {
      return
    }
    const type = nested.childNodes[0]
    if (!(type instanceof Text)) {
      return
    }
    const line = type.nodeValue ?? ''
    const result = TYPE_SEARCH_REGX.exec(line)
    if (!result || !result.groups || !result.groups.type) {
      return
    }
    const attrs = SUPPORTED_TYPE[result.groups.type]
    if (!attrs) {
      return
    }
    const pos = line.indexOf(os.EOL)
    if (pos >= 0) {
      type.nodeValue = type.nodeValue.substring(pos + 2)
    } else {
      // remove the blockquote type marker and html tag `br`.
      nested.children = nested.children.slice(2)
    }
    const children = domToReact(node.children.slice(1) as DOMNode[])
    return React.createElement(GithubBlockquote, { ...attrs }, children)
  }
}
export default blockQuoteHandler