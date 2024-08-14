'use client'
import type { MouseEventHandler } from 'react'
import React, { useEffect } from 'react'
import styles from './drawer.module.scss'
import { concatClassName } from '@/lib/DomUtils'
import { createPortal } from 'react-dom'

interface DrawerProps {
  open?: boolean
  destroyOnClose?: boolean
  onClose?: () => void
}

/**
 * Drawer. (half window)
 */
const Drawer:React.FC<React.PropsWithChildren<DrawerProps>> = props => {
  const [unmounted, setUnmounted] = React.useState(true)
  const [innerOpenState, setInnerOpenState] = React.useState(props.open)
  
  useEffect(() => {
    setUnmounted(false)
  }, [])

  const onMaskClick = () => {
    setInnerOpenState(false)
    setTimeout(() => {
      props.onClose?.()
    }, 500)
  }

  useEffect(() => {
    setInnerOpenState(props.open)
  }, [props.open])
  
  const handleInnerClick: MouseEventHandler<unknown> = (e) => {
    e.stopPropagation()
  }

  if (unmounted) {
    return null
  }
  
  return createPortal(
    <div style={{ display: props.open ? undefined : 'none' }} className={concatClassName(innerOpenState ? styles.open : styles.close, styles.drawerContainer)} onClick={onMaskClick}>
      <div className="w-screen h-screen">
        <div className="bg-background w-2/3 h-full" onClick={handleInnerClick}>
          {props.children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Drawer