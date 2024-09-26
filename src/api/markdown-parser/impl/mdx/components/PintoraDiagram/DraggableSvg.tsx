'use client'

import React, { useEffect, useRef, useState } from 'react'

interface DraggableSvgProps {
  pruneSvgHTML: string
}

type DragState = {
  startX: number
  startY: number
  eleOffset: EleOffset
  dragging: boolean
}

type EleOffset = {
  x: number
  y: number
}

const DraggableSvg: React.FC<DraggableSvgProps> = props => {
  const holderRef = useRef<HTMLDivElement>(null)
  const [eleOffset, setEleOffset] = useState<EleOffset>({ x: 0, y: 0 })
  const state = useRef<DragState>({ startX: 0, startY: 0, dragging: false, eleOffset: { x: 0, y: 0 } }) 

  useEffect(() => {
    const holder = holderRef.current
    if (!holder) {
      return
    }
    const mouseDownEvtHandler = (ev: MouseEvent) => {
      const current = state.current
      current.startX = ev.x
      current.startY = ev.y
      current.dragging = true
    }
    
    const mouseUpEvtHandler = (ev: MouseEvent) => {
      const current = state.current
      if (!current.dragging) {
        return
      }
      current.dragging = false
      current.eleOffset = {
        x: current.eleOffset.x - (current.startX - ev.x),
        y: current.eleOffset.y - (current.startY - ev.y)
      }
    }
    
    const mouseMoveEvtHandler = (ev: MouseEvent) => {
      const current = state.current
      if (!current.dragging) {
        return
      }
      setEleOffset({
        x: current.eleOffset.x - (current.startX - ev.x),
        y: current.eleOffset.y - (current.startY - ev.y)
      })
    }

    holder.addEventListener('mousedown', mouseDownEvtHandler)
    holder.addEventListener('mouseup', mouseUpEvtHandler)
    holder.addEventListener('mousemove', mouseMoveEvtHandler)
    holder.addEventListener('mouseout', mouseUpEvtHandler)

    return () => {
      holder.removeEventListener('mousedown', mouseDownEvtHandler)
      holder.removeEventListener('mouseup', mouseUpEvtHandler)
      holder.removeEventListener('mousemove', mouseMoveEvtHandler)
      holder.removeEventListener('mouseout', mouseUpEvtHandler)
    }
  }, [])
  
  return (
    <div style={{ color: 'var(--color-card)', display: 'flex', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--color-card)' }}>
      <div ref={holderRef} dangerouslySetInnerHTML={{ __html: props.pruneSvgHTML }} style={{ transform: `translate(${eleOffset.x}px, ${eleOffset.y}px)` }}></div>
    </div>
  )
}

export default DraggableSvg