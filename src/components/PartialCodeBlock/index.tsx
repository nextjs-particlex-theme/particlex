'use client'
import React, { useRef, useState } from 'react'
import style from './post-content.module.scss'
import { faArrowTurnDown, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface PartialCodeBlockProps {
  content: string
  lang: string
}


interface RichContentProps extends PartialCodeBlockProps {
  wrapLine: boolean
  onRequirePartialHide: () => void
}

const _RichContent: React.FC<RichContentProps> = props => {
  const codeContainer = useRef<HTMLDivElement>(null)

  return (
    <div className={style.codeContent} ref={codeContainer} style={props.wrapLine ? { textWrap: 'wrap' } : undefined} dangerouslySetInnerHTML={{ __html: props.content }}/>
  )
}

const RichContent = React.memo(_RichContent)

const _PartialCodeBlock: React.FC<PartialCodeBlockProps> = props => {
  const [wrapLineActive, setWrapLineActive] = React.useState(false)
  const [copyIconClass, setCopyIconClass] = React.useState(style.icon)
  const [partialHide, setPartialHide] = useState(false)

  const onWrapLineClick = () => {
    setWrapLineActive(!wrapLineActive)
  }

  const onCopyDown = () => {
    setCopyIconClass(style.iconClick)
  }

  const onCopyUp = () => {
    navigator.clipboard.writeText(props.content).catch(e => {
      alert(e.message)
    })
    setTimeout(()=> {
      setCopyIconClass(style.icon)
    }, 200)
  }

  const onRequireHide = () => {
    setPartialHide(true)
  }

  const showAllClick = () => {
    setPartialHide(false)
  }

  return (
    <pre>
      <div className="z-50 relative" style={partialHide ? { maxHeight: '50vh' } : undefined}>
        <RichContent {...props} wrapLine={wrapLineActive} onRequirePartialHide={onRequireHide} />
        <div className={style.languageTag}>{props.lang}</div>
        <div className={style.toolBar}>
          <FontAwesomeIcon title="自动换行" icon={faArrowTurnDown} className={wrapLineActive ? style.iconClick : style.icon} onClick={onWrapLineClick}/>
          <FontAwesomeIcon title="复制" onMouseDown={onCopyDown} onMouseUp={onCopyUp} icon={faCopy} className={copyIconClass}/>
        </div>
        {
          partialHide ?
            (
              <div className={style.partialCover}>
                <a onClick={showAllClick}>
                  显示全部
                </a>
              </div>
            ) : null
        }
      </div>
    </pre>
  )
}

const PartialCodeBlock = React.memo(_PartialCodeBlock)

export default PartialCodeBlock