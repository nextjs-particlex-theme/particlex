'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import postStyle from '@/components/post.module.scss'
import reactParse, { domToReact, Element, Text } from 'html-react-parser'
import PartialCodeBlock from '@/components/PostContent/PartialCodeBlock'
import JellyLoading from '@/components/JellyLoading'
import hljs from 'highlight.js'

interface PostContentProps {
  html: string
}


const PostContent:React.FC<PostContentProps> = props => {
  const [child, setChild] = useState<React.ReactNode>(null)

  useEffect(() => {
    const child = reactParse(props.html, {
      replace: (domNode, index) => {
        if (domNode instanceof Element && domNode.tagName === 'pre' && domNode.children.length === 1) {
          const ele = domNode.children[0]
          if (ele instanceof Element) {
            const text = ele.childNodes[0]
            if (text instanceof Text) {
              console.log(text.nodeValue)
              return (
                <PartialCodeBlock content={text.data} lang={ele.attribs['class']}/>
              )
            }
          }
        }

      }
    })
    setChild(child)
  }, [props.html])

  return (
    <div className={`${postStyle.postContainer} link-styled-container`}>
      {
        child
      }
    </div>
  )
}

export default PostContent