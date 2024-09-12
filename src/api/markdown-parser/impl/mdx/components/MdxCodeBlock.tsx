import type React from 'react'
import PartialCodeBlock from '@/api/markdown-parser/components/PartialCodeBlock'

type MdxCodeBlockProps = {
  children: React.ReactNode & {
    type: 'code',
    className?: string
    children: string
    props: {
      children: string
    }
  }
}
const MdxCodeBlock: React.FC = (p) => {
  const props = p as MdxCodeBlockProps
  return (
    <PartialCodeBlock html={props.children.props.children} codeBlockClassname={props.children.props.className}/>
  )
}

export default MdxCodeBlock
