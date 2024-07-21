import React, { useEffect, useRef, useState } from 'react'
import getHljsInstance from '@/lib/highlight'
import style from './post-content.module.scss'
import { faArrowTurnDown, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface PartialCodeBlockProps {
  content: string
  lang: string
}


const _RichContent: React.FC<PartialCodeBlockProps & {wrapLine: boolean}> = props => {
  const codeContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parser = new DOMParser()
    getHljsInstance().then(r => {
      if (codeContainer.current) {
        if (process.env.NODE_ENV === 'development') {
          codeContainer.current.removeAttribute('data-highlighted')
        }
        r.highlightElement(codeContainer.current)
      }
    })
  }, [props, props.content])

  return (
    <div className={style.codeContent} ref={codeContainer} style={props.wrapLine ? { textWrap: 'wrap' } : undefined}>
      { props.content }
    </div>
  )
}

const RichContent = React.memo(_RichContent)

const _PartialCodeBlock: React.FC<PartialCodeBlockProps> = props => {
  const [wrapLineActive, setWrapLineActive] = React.useState(false)
  const [copyIconClass, setCopyIconClass] = React.useState(style.icon)


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

  return (
    <pre>
      <div className="z-50 relative">
        <RichContent {...props} wrapLine={wrapLineActive} />
        <div className={style.languageTag}>{props.lang}</div>
        <div className={style.toolBar}>
          <FontAwesomeIcon title="自动换行" icon={faArrowTurnDown} className={wrapLineActive ? style.iconClick : style.icon} onClick={onWrapLineClick}/>
          <FontAwesomeIcon title="复制" onMouseDown={onCopyDown} onMouseUp={onCopyUp} icon={faCopy} className={copyIconClass}/>
        </div>
      </div>
    </pre>
  )
}

const PartialCodeBlock = React.memo(_PartialCodeBlock)

export default PartialCodeBlock