import React from 'react'
import os from 'node:os'
import type { GithubCodeBlockProps } from '@/api/markdown-parser/components/GithubBlockquote'
import GithubBlockquote, { SUPPORTED_TYPE } from '@/api/markdown-parser/components/GithubBlockquote'

type ChildItem = Array<string | {
  props: {
    children: ChildItem
  }
  type: string
  key: any
}> | string

type MdxProps = {
  children: ChildItem
}

const SEARCH_REGX = /\[!(\w+)]/

function resolveAndRemoveType(props: MdxProps): [React.ReactNode, GithubCodeBlockProps] | undefined {
  // What an ugly code😅... Does someone can help me to refactor it?
  let paragraph = props.children?.[1]
  if (typeof paragraph === 'string') {
    return
  }
  if (typeof paragraph.props.children === 'string') {
    const matched = SEARCH_REGX.exec(paragraph.props.children)
    if (!matched) {
      return
    }
    const attr = SUPPORTED_TYPE[matched[1]]
    if (!attr) {
      return
    }
    const copiedRoot = [...props.children]
    const copiedParagraph = { ...paragraph }
    copiedRoot[1] = copiedParagraph

    let begin = paragraph.props.children.substring(matched[0].length)
    if (begin.startsWith(os.EOL)) {
      begin = begin.substring(os.EOL.length)
    }
    copiedParagraph.props = {
      children: begin
    }

    return [copiedRoot, attr]
  }
  const line = paragraph.props.children[0]
  if (typeof line !== 'string') {
    return
  }
  const matched = SEARCH_REGX.exec(line)
  if (!matched) {
    return
  }
  const attr = SUPPORTED_TYPE[matched[1]]
  if (!attr) {
    return
  }
  const copiedRoot = [...props.children]
  const copiedParagraph = { ...paragraph }
  copiedParagraph.props = { ...copiedParagraph.props }
  copiedRoot[1] = copiedParagraph

  const cpiedParagraphChild = [...paragraph.props.children]
  cpiedParagraphChild[0] = line.substring(3 + os.EOL.length + matched[1].length)
  copiedParagraph.props.children = cpiedParagraphChild
  return [copiedRoot, attr]
}

const MdxBlockQuote:React.FC = (p) => {
  const props = p as MdxProps

  const result = resolveAndRemoveType(props)
  if (!result) {
    return React.createElement('blockquote', props)
  }
  const [root, attr] = result

  return (
    <GithubBlockquote {...attr}>
      { root }
    </GithubBlockquote>
  )
}

export default MdxBlockQuote