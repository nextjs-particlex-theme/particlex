'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/api/datasource/types'
import Link from 'next/link'
import('./toc.scss')


type ExpandedTocItem = Omit<TocItem, 'child'> & {
  level: number
}

export const MAIN_CONTENT_ID = 'main-content'

interface TableOfContentProps {
  tocItems: TocItem[]
}

type HeadingElement = {
  ele: HTMLHeadingElement
  level: number
}

/**
 * 目录组件.
 * 使用时必须将为文章容器元素添加id： {@link MAIN_CONTENT_ID}
 */
const TableOfContent:React.FC<TableOfContentProps> = props => {
  const topics = useRef<HeadingElement[]>([])
  const [expandedTocItems, setExpandedTocItems] = useState<ExpandedTocItem[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [containerWidth, setContainerWidth] = useState(0)
  const lock = useRef(false)

  useEffect(() => {
    const r: ExpandedTocItem[] = []

    type StackItem = {
      level: number
      item: TocItem
    }
    const stack: StackItem[] = []

    for (let tocItem of props.tocItems) {
      stack.push({
        item: tocItem,
        level: 1
      })
      while (stack.length) {
        const p = stack.pop()!
        r.push({
          ...p.item,
          level: p.level
        })
        for (let i = p.item.child.length - 1; i >= 0; --i) {
          const nextChild = p.item.child[i]
          stack.push({
            item: nextChild,
            level: p.level + 1
          })
        }
      }
    }
  
    setExpandedTocItems(r)
  }, [props.tocItems])

  useEffect(() => {
    const mainContainer = document.getElementById(MAIN_CONTENT_ID)
    if (!mainContainer) {
      console.error('没有为内容元素添加id: ' + MAIN_CONTENT_ID)
      return
    }
    const r: HeadingElement[] = []
    mainContainer.childNodes.forEach(n => {
      if (!(n instanceof HTMLHeadingElement)) {
        return
      }
      let level: number
      if (Number.isNaN(level = Number.parseInt(n.nodeName[1]))) {
        return
      }
      r.push({
        ele: n,
        level
      })
    })
    topics.current = r
  }, [])

  useEffect(() => {
    function scrollListener() {
      if (lock.current) {
        return
      }
      let i = topics.current.length - 1
      for (; i >= 0; --i) {
        const toc = topics.current[i]
        // 检查当前元素是否在以当前窗口<b>中间</b>为界限的上面
        if (toc.ele.offsetTop < (document.documentElement.scrollTop + window.innerHeight / 3)) {
          setActiveIndex(i)
          break
        }
      }
      if (i === -1) {
        setActiveIndex(0)
      }
    }
    
    function resizeListener() {
      const { clientWidth } = document.documentElement
      // 防止顶部header挡住目录, 16 * 56 为 56rem...
      setContainerWidth((clientWidth - 16 * 56) / 2)
    }
    
    window.addEventListener('scroll', scrollListener)
    window.addEventListener('resize', resizeListener)

    scrollListener()
    resizeListener()
    
    return () => {
      window.removeEventListener('scroll', scrollListener)
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  const onTocItemClick = (index: number) => {
    lock.current = true
    setActiveIndex(index)
    setTimeout(() => {
      lock.current = false
    }, 100)
  }

  return (
    <div className="toc-out-container" style={{ width: containerWidth }}>
      <div className="toc-container">
        <div className="text-xl">目录</div>
        {
          expandedTocItems.map((v, index) => (
            <Link key={v.anchor}
              onClick={() => onTocItemClick(index)}
              href={v.anchor}
              className={`title-${v.level} ${activeIndex === index ? 'active-title' : ''}`}>
              {v.title}
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default TableOfContent