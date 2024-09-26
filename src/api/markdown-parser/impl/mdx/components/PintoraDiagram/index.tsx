import type React from 'react'
import { render } from '@pintora/cli'
import DraggableSvg from '@/api/markdown-parser/impl/mdx/components/PintoraDiagram/DraggableSvg'


interface PintoraDiagramProps {
  code: string
  draggable?: boolean
}

/**
 * @see https://pintorajs.vercel.app/
 */
const PintoraDiagram: React.FC<PintoraDiagramProps> = async props => {
  const svg = await render({
    code: props.code,
    mimeType: 'image/svg+xml',
    width: 800,
    backgroundColor: 'currentColor',
    renderInSubprocess: false
  }) as string

  if (props.draggable) {
    return (
      <DraggableSvg pruneSvgHTML={svg}/>
    )
  }
  return <div style={{ color: 'var(--color-card)', display: 'flex', justifyContent: 'center' }}
    dangerouslySetInnerHTML={{ __html: svg }}></div>
}

export default PintoraDiagram
