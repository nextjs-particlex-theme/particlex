import reactParse, { Element, Text } from 'html-react-parser'
import hljs from 'highlight.js'
import React from 'react'
import PartialCodeBlock from '@/components/PartialCodeBlock'

/**
 * code block
 */
function dealWithPreTag(domNode: Element) {
  if (domNode.children.length !== 1) {
    throw new Error('Unexpected child data, expected only one child: ' + domNode)
  }
  const ele = domNode.children[0]
  if (!(ele instanceof Element)) {
    return
  }
  const text = ele.childNodes[0]
  if (text instanceof Text) {
    const classes = ele.attribs['class']
    let lang: string[]
    if (classes) {
      lang = classes.split(' ')
      if (lang.length === 0) {
        lang = ['plaintext']
      } else {
        const fb = LANGUAGE_MAPPING_FALLBACK[lang[0]]
        if (fb) {
          lang.push(fb)
        }
      }
    } else {
      lang = ['plaintext']
    }

    const lighted = hljs.highlightAuto(text.data, lang).value
    return React.createElement(PartialCodeBlock, { content: lighted, lang: lang[0] })
  }
}

function dealWithImage(domNode: Element) {
  if (domNode.attribs) {
    domNode.attribs['loading'] = 'lazy'
  }
}

/**
 * 直接让 highlight.js 自动高冷渲染太慢了，必须主动指定语言，这里为了防止一些简写或者某些特定的语言，设置一些回退选项
 */
const LANGUAGE_MAPPING_FALLBACK: Record<string, string | undefined> = {
  vue: 'html',
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash'
}


/**
 * 处理 html 博客内容
 */
export default function processPostContent(html: string): React.ReactNode {
  return reactParse(html, {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) {
        return 
      }
      switch (domNode.tagName) {
      case 'pre':
        return dealWithPreTag(domNode)
      case 'img':
        return dealWithImage(domNode)
      default:
        return
      }
    }
  })
}

