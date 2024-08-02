'use client'
import React, { useEffect, useRef, useState } from 'react'
import style from './post-content.module.scss'
import { Icons } from '@/app/svg-symbols'
import { concatClassName } from '@/lib/DomUtils'

interface PartialCodeBlockProps {
  content: string
  lang: string
}

const _PartialCodeBlock: React.FC<PartialCodeBlockProps> = props => {
  const [wrapLineActive, setWrapLineActive] = React.useState(false)
  const [copyIconClass, setCopyIconClass] = React.useState(style.icon)
  const [partialHide, setPartialHide] = useState(false)
  const codeContainer = useRef<HTMLDivElement>(null)
  const [copyAniClass, setCopyAniClass] = React.useState(style.copyAniBegin)

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
    setCopyAniClass(style.copyAniShow)
    setTimeout(()=> {
      setCopyIconClass(style.icon)
      setCopyAniClass(style.copyAniEnd)
      setTimeout(() => {
        setCopyAniClass((current) => {
          if (current === style.copyAniEnd) {
            return style.copyAniBegin
          }
          return current
        })
      }, 500)
    }, 1000)
  }

  const showAllClick = () => {
    setPartialHide(false)
  }

  useEffect(() => {
    if (!codeContainer.current) {
      return
    }
    if (codeContainer.current.clientHeight >= window.innerHeight / 2) {
      setPartialHide(true)
    }
  }, [])

  return (
    <pre>
      <div className="z-50 relative" style={partialHide ? { maxHeight: '50vh' } : undefined}>
        <div className={style.codeContent} 
          ref={codeContainer} 
          style={wrapLineActive ? { textWrap: 'wrap' } : undefined}
          dangerouslySetInnerHTML={{ __html: props.content }}/>
        <div className={style.languageTag}>{props.lang}</div>
        <div className={style.toolBar}>
          <span title="自动换行">
            <svg width={15} height={15} onClick={onWrapLineClick}
              className={wrapLineActive ? style.iconClick : style.icon}><use
                xlinkHref={Icons.WRAP_LINE}/></svg>
          </span>
          <div className={style.copyContainer} title="复制">
            <svg width={15} height={15} onMouseDown={onCopyDown} onMouseUp={onCopyUp} className={copyIconClass}><use
              xlinkHref={Icons.COPY}/></svg>
            <div className={concatClassName(style.copySuccessIcon, copyAniClass)}>复制成功</div>
          </div>
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