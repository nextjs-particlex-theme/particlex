import type React from 'react'
import type { PintoraConfig } from '@pintora/cli'
import { render } from '@pintora/cli'


interface PintoraDiagramProps {
  code: string
  config?: PintoraConfig
}

/**
 * @see https://pintorajs.vercel.app/
 */
const PintoraDiagram: React.FC<PintoraDiagramProps> = async props => {
  // const r = pintora.parseAndDraw(props.code, { config: props.config })
  // console.log(r)
  const svg = await render({
    code: props.code,
    pintoraConfig: props.config,
    mimeType: 'image/svg+xml',
    width: 800,
    backgroundColor: 'currentColor',
    renderInSubprocess: false
  })
  return (
    <div style={{ color: 'var(--color-card)', display: 'flex', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: svg }}></div>
  )
}

export default PintoraDiagram
