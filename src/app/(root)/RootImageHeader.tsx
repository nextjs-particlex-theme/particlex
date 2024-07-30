'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './root-style.module.scss'

interface RootImageHeaderProps {
  images?: string[]
  title: string
  description?: string
  subtitle?: string
}


const MAX_OFFSET = 84

const RootImageHeader:React.FC<RootImageHeaderProps> = props => {
  const [image, setImage] = useState<string>()
  const [offset, setOffset] = useState(0)
  const lockOffset = useRef(false)

  useEffect(() => {
    if (!props.images || props.images.length === 0) {
      console.warn('没有配置首页轮播图! 请修改 theme_config.background 配置')
    } else {
      const pos = Math.floor(Math.random() * props.images.length)
      setImage(`url(${props.images[pos]})`)
    }
  }, [props.images])

  useEffect(() => {
    const onScroll = () => {
      if (lockOffset.current) {
        return
      }
      setOffset(Math.min(MAX_OFFSET, document.documentElement.scrollTop / 5))
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])


  const navToPosts = () => {
    // lockOffset.current = true
    window.scrollTo({
      top: window.innerHeight ,
      behavior: 'smooth'
    })
    setTimeout(() => {
      // lockOffset.current = false
    }, 100)
  }

  if (!image) {
    return null
  }
  return (
    <div style={{ backgroundImage: image, marginBottom: `-${offset}px` }} className={styles.imageContainer}>
      <div className={styles.loopContainer} onClick={navToPosts}>
        <div className={styles.loop}/>
        <div className={styles.loop}/>
        <div className={styles.loop}/>
        <div className={styles.loop}/>
        <div className={styles.titleContainer}>
          <span className="text-5xl">{ props.title }</span>
          <span className="text-2xl pt-4">{ props.subtitle }</span>
          <span className="text-base pt-4">{ props.description }</span>
        </div>
      </div>
    </div>
  )
}

export default RootImageHeader
