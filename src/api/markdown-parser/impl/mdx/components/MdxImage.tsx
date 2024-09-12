import type React from 'react'
import PreviewableImage from '@/components/PreviewableImage'

interface MdxImageProps {
  src: string
  alt: string
}

const MdxImage: React.FC = (p) => {
  const props = p as MdxImageProps
  return <PreviewableImage src={props.src} alt={props.alt}/>
}

export default MdxImage
