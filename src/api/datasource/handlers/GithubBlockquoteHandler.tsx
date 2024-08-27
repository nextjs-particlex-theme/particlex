import type HtmlTagHandler from '@/api/datasource/types/HtmlTagHandler'
import type { Element, HTMLReactParserOptions } from 'html-react-parser'
import { domToReact } from 'html-react-parser'
import { Text } from 'html-react-parser'
import type React from 'react'
import type { DOMNode } from 'html-dom-parser'
import { Icons } from '@/app/svg-symbols'

type BlockquoteAvailableTypes = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION'

interface GithubHighlightCodeBlockProps {
  icon: string
  color: string
  tip: string
  width?: number
  height?: number
}

function initConstant(): Record<string, GithubHighlightCodeBlockProps | undefined> {
  let map0: Record<BlockquoteAvailableTypes, GithubHighlightCodeBlockProps>
  map0 = {
    NOTE: {
      icon: Icons.INFO,
      color: 'var(--color-primary)',
      tip: 'Note'
    },
    CAUTION: {
      icon: Icons.INFO,
      color: 'var(--color-error)',
      tip: 'Caution'
    },
    TIP: {
      icon: Icons.LIGHTBULB,
      color: 'green',
      tip: 'Tip'
    },
    IMPORTANT: {
      icon: Icons.STAR,
      color: 'purple',
      tip: 'Important'
    },
    WARNING: {
      icon: Icons.WARNING,
      color: '#995010',
      tip: 'Warning',
      width: 17,
      height: 17
    }
  }
  return map0
}

const SUPPORTED_TYPE = initConstant()


const GithubHighlightCodeBlock: React.FC<React.PropsWithChildren<GithubHighlightCodeBlockProps>> = ({
  children, 
  color,
  icon,
  tip,
  height = 15,
  width = 15
}) => {
  return (
    <blockquote style={{ borderLeftColor: color }}>
      <div className="flex items-center mt-4" style={{ color }}>
        <svg width={width} height={height} >
          <use xlinkHref={icon}/>
        </svg>
        <span className="ml-2">{ tip }</span>
      </div>
      {children}
    </blockquote>
  )
}


const TYPE_SEARCH_REGX = /\[!(?<type>[A-Z]+)]/


const githubBlockquoteHandler: HtmlTagHandler = {
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
    const result = TYPE_SEARCH_REGX.exec(type.nodeValue)
    if (!result || !result.groups || !result.groups.type) {
      return
    }
    const props = SUPPORTED_TYPE[result.groups.type]
    if (!props) {
      return 
    }
    // remove the blockquote type marker and html tag `br`.
    nested.children = nested.children.slice(2)
    const children = domToReact(node.children.slice(1) as DOMNode[])
    return (
      <GithubHighlightCodeBlock {...props}>
        { children }
      </GithubHighlightCodeBlock>
    )
  }
}

export default githubBlockquoteHandler