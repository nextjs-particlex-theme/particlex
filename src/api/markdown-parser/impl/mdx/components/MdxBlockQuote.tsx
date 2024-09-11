import React from 'react'
import os from 'node:os'
import GithubBlockquote, { SUPPORTED_TYPE } from '@/api/markdown-parser/components/GithubBlockquote'

interface MdxBlockQuoteProps {
  children: Array<{
    props: {
      children: string
    }
  } | string>
}

const MdxBlockQuote:React.FC = (p) => {
  const props = p as MdxBlockQuoteProps
  if (props.children.length < 2) {
    return React.createElement('blockquote', props)
  }
  const obj = props.children[1]
  if (typeof obj === 'string') {
    return React.createElement('blockquote', props)
  }
  const content = obj.props.children
  const lines = content.split(os.EOL)

  let type = lines[0]
  if (type.length <= 3) {
    return React.createElement('blockquote', props)
  }
  type = type.substring(2, type.length - 1)
  const sp = SUPPORTED_TYPE[type]
  if (!sp) {
    return React.createElement('blockquote', props)
  }
  const contentLines = lines.slice(1)
  return (
    <GithubBlockquote {...sp}>
      { contentLines.map((v, index) => (<p key={index}>{v}</p>))}
    </GithubBlockquote>
  )
}

export default MdxBlockQuote