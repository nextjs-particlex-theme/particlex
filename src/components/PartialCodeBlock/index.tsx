'use client'
import React, { useRef, useState } from 'react'
import style from './post-content.module.scss'
import { Icons } from '@/app/svg-symbols'
import CopyIconButton from '@/components/PartialCodeBlock/CopyIconButton'

interface PartialCodeBlockProps {
  content: string
  lang: string
}

const _PartialCodeBlock: React.FC<PartialCodeBlockProps> = props => {
  const [wrapLineActive, setWrapLineActive] = React.useState(false)
  const codeContainer = useRef<HTMLDivElement>(null)
  const [expandActive, setExpandActive] = useState(false)

  const onWrapLineClick = () => {
    setWrapLineActive(!wrapLineActive)
  }
  

  const onCopyUp = () => {
    navigator.clipboard.writeText(props.content).catch(e => {
      alert(e.message)
    })
  }

  const onExpandClick = () => {
    setExpandActive(!expandActive)
  }


  return (
    <pre>
      <div className="z-50 relative pt-12 pb-5">
        <div className={style.codeContent} 
          ref={codeContainer} 
          style={{ textWrap: wrapLineActive ? 'wrap' : undefined, maxHeight: expandActive ? undefined : '50vh' }}
          dangerouslySetInnerHTML={{ __html: props.content }}/>
        <div className={style.languageTag}>{props.lang}</div>
        <div className={style.toolBar}>
          <span title="自动换行">
            <svg width={18} height={18} onClick={onWrapLineClick} className={wrapLineActive ? style.iconClick : style.icon}>
              <use xlinkHref={Icons.WRAP_LINE}/></svg>
          </span>
          <span title="展开">
            <svg width={15} height={15} onClick={onExpandClick} className={expandActive ? style.iconClick : style.icon}>
              <use xlinkHref={Icons.EXPAND}/></svg>
          </span>
          <CopyIconButton onCopy={onCopyUp}/>
        </div>
      </div>
    </pre>
  )
}

const PartialCodeBlock = React.memo(_PartialCodeBlock)

export default PartialCodeBlock