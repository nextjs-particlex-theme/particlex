'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import('./toc.scss')


type ExpandedTocItem = {
  level: number
  /**
   * 标题，该值为 html 文本！
   */
  title: string
  /**
   * 锚点，以 # 开头
   */
  anchor: string
  ele: HTMLHeadingElement
}

const LEVEL_MAPPING: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
}

/**
 * 根据 html 自动生成 Toc.
 */
function generateToc(root: HTMLElement): ExpandedTocItem[] {
  const result: ExpandedTocItem[] = []
  for (const v of root.childNodes) {
    const currentLevel = LEVEL_MAPPING[v.nodeName.toLowerCase()]
    if (currentLevel === undefined) {
      continue
    }
    const heading = v as HTMLHeadingElement

    result.push({
      title: heading.innerHTML,
      anchor: '#' + heading.getAttribute('id'),
      level: currentLevel,
      ele: heading
    })
  }
  return result
}

export const MAIN_CONTENT_ID = 'main-content'



/**
 * 目录组件.
 * 使用时必须将为文章容器元素添加id： {@link MAIN_CONTENT_ID}
 * TODO 适配移动端.
 */
const TableOfContent:React.FC = () => {
  // 平铺的标题
  const [tocItems, setTocItems] = useState<ExpandedTocItem[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [containerWidth, setContainerWidth] = useState(0)
  const lock = useRef(false)

  useEffect(() => {
    const mainContainer = document.getElementById(MAIN_CONTENT_ID)
    if (!mainContainer) {
      console.error('没有为内容元素添加id: ' + MAIN_CONTENT_ID)
      return
    }
    setTocItems(generateToc(mainContainer))
  }, [])

  useEffect(() => {
    function scrollListener() {
      if (lock.current) {
        return
      }
      let i = tocItems.length - 1
      for (; i >= 0; --i) {
        const toc = tocItems[i]
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
  }, [tocItems])

  const onTocItemClick = (index: number) => {
    lock.current = true
    setActiveIndex(index)
    setTimeout(() => {
      lock.current = false
    }, 100)
  }

  if (tocItems.length === 0) {
    return null
  }

  return createPortal(
    (
      <div className="hidden md:block">
        <div className="toc-out-container" style={{ width: containerWidth }}>
          <div className="toc-container">
            <div className="text-xl">目录</div>
            {
              tocItems.map((v, index) => (
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
      </div>
    ),
    document.body
  )
}

export default TableOfContent