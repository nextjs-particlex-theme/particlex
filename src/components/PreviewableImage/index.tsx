'use client'
import React, { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { concatClassName } from '@/lib/DomUtils'

interface ImagePreviewProps {
  src: string
  alt: string
}


interface FullScreenPreviewProps extends ImagePreviewProps {
  onClose: () => void
}

const FullScreenPreview: React.FC<FullScreenPreviewProps> = props => {
  const [opacity, setOpacity] = useState(0)
  const onClose = () => {
    if (opacity === 0) {
      // closing...
      return
    }
    setOpacity(0)
    setTimeout(() => {
      props.onClose()
    }, 310)
  }
  
  useEffect(() => {
    setOpacity(1)
  }, [])
  
  return (
    <div className="transition-opacity duration-300 w-screen h-screen fixed top-0 left-0 bg-mask flex items-center justify-center"
      style={{ opacity }} onClick={onClose}>
      <img src={props.src} alt={props.alt} className="scale-110"/>
    </div>
  )
}

/**
 * 可以放大预览的图片
 */
const PreviewableImage: React.FC<ImagePreviewProps> = props => {
  const [previewing, setPreviewing] = useState<React.ReactNode>(false)
  
  const onImageClick = () => {
    setPreviewing(true)
  }

  const onPreviewClose = () => {
    setPreviewing(false)
  }

  return (
    <Fragment>
      <img src={props.src} alt={props.alt} loading="lazy" onClick={onImageClick}></img>
      {
        previewing ?
          createPortal(<FullScreenPreview {...props} onClose={onPreviewClose}/>, document.body)
          : null
      }
    </Fragment>
  )
}

export default PreviewableImage