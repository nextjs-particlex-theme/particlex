import React from 'react'
import os from 'node:os'
import type { GithubCodeBlockProps } from '@/api/markdown-parser/components/GithubBlockquote'
import GithubBlockquote, { SUPPORTED_TYPE } from '@/api/markdown-parser/components/GithubBlockquote'
import { deepCopy } from '@/lib/ObjectUtils'


type ChildItem = Array<string | {
  props: {
    children: ChildItem
  }
  key: any
}>

interface MdxBlockQuoteProps {
  children: ChildItem
}

function splitType(line: string): string | undefined {
  const cols = line.split(os.EOL)
  const type = cols[0]
  if (type.length <= 3) {
    return
  }
  return type.substring(2, type.length - 1)
}

function resolveAndRemoveType(originalContent: ChildItem): [ChildItem, GithubCodeBlockProps] | undefined {
  if (originalContent.length < 2) {
    return
  }
  let type: string | undefined
  
  const item = originalContent[1]
  if (typeof item === 'string') {
    type = splitType(item)
    let attr
    if (!type || !(attr = SUPPORTED_TYPE[type])) {
      return 
    }
    const copied = [...originalContent]
    copied[1] = item.substring(type.length + 3)
    return [copied, attr]
  } 
  // obj
  const ch = item.props.children[0]
  if (typeof ch === 'string') {
    type = splitType(ch)
    let attr
    if (!type || !(attr = SUPPORTED_TYPE[type])) {
      return
    }
    const copied = [...originalContent]
    const copiedChild = deepCopy(item)
    copiedChild.key = '1'
    copied[1] = copiedChild
    // item.props.children = copiedChild
    copiedChild.props.children[0] = ch.substring(type.length + 3)
    return [copied, attr]
  }
  return undefined
}

const MdxBlockQuote:React.FC = (p) => {
  const props = p as MdxBlockQuoteProps

  const result = resolveAndRemoveType(props.children)
  if (!result) {
    return React.createElement('blockquote', props)
  }
  const [root, attr] = result

  return (
    <GithubBlockquote {...attr}>
      { root as React.ReactNode }
    </GithubBlockquote>
  )
}

export default MdxBlockQuote