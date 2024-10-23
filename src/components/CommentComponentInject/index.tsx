'use client'
import type React from 'react'
import { useEffect } from 'react'


/**
 * 注入评论组件.
 */
const CommentComponentInject: React.FC = () => {

  useEffect(() => {
    const script = process.env.NEXT_PUBLIC_COMMENT_SCRIPT_INJECT
    const identifier = process.env.NEXT_PUBLIC_COMMENT_CONTAINER_IDENTIFIER
    if (!script || !identifier || !(identifier.startsWith('.') || identifier.startsWith('#'))) {
      return
    }

    const parser = new DOMParser()

    const doc = parser.parseFromString(script, 'text/html')
    const collection = doc.head.children

    const appended: Element[] = []
    for (let i = 0; i < collection.length; ++i) {
      const e = collection[i]
      if (!e) {
        continue
      }
      if (e.tagName === 'SCRIPT') {
        const names = e.getAttributeNames()
        const scriptElement = document.createElement('script')
        for (const name of names) {
          const v = e.getAttribute(name)
          if (v) {
            scriptElement.setAttribute(name, v)
          }
        }
        appended.push(scriptElement)
        document.head.appendChild(scriptElement)
      } else {
        appended.push(e)
        document.head.appendChild(e)
      }
    }

    return () => {
      for (let i = 0; i < appended.length; ++i) {
        const e = appended[i]
        if (e) {
          document.head.removeChild(e)
        }
      }
    }
  }, [])

  const script = process.env.NEXT_PUBLIC_COMMENT_SCRIPT_INJECT
  const identifier = process.env.NEXT_PUBLIC_COMMENT_CONTAINER_IDENTIFIER
  const doInject = script
    && identifier
    && (identifier.startsWith('.') || identifier.startsWith('#'))

  if (!doInject) {
    return null
  }
  let id: string | undefined
  let className: string | undefined
  if (identifier.startsWith('.')) {
    className = identifier.substring(1)
  } else {
    // start with #
    id = identifier.substring(1)
  }
  return (
    <div id={id} className={className}/>
  )
}


export default CommentComponentInject
