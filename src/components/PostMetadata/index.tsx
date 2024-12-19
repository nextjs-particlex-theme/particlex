import React from 'react'
import { Icons } from '@/app/svg-symbols'
import Link from 'next/link'
import type { ClientSafePost } from '@/api/datasource/types/Post'
import type Post from '@/api/datasource/types/Post'
import { concatClassName } from '@/lib/DomUtils'

interface PostMetadataProps {
  post: Readonly<Post | ClientSafePost>
  className?: string
  hideDate?: boolean
}

/**
 * 博客元数据。用于展示 tag 等
 */
const PostMetadata: React.FC<PostMetadataProps> = ({ hideDate, post, className }) => {
  return (
    <div className={concatClassName('flex text-subtext [&>div:nth-child(n+2)]:ml-2', className)}>
      {
        hideDate || !post.formattedTime ?
          null :
          <div className="flex">
            <svg width={16} height={16}>
              <use xlinkHref={Icons.CALENDAR}/>
            </svg>
            <span className="ml-2">{post.formattedTime}</span>
          </div>
      }
      {
        post.categories.length > 0 ?
          (
            <div className="flex items-center">
              <svg width={16} height={16}>
                <use xlinkHref={Icons.BOOKMARK}/>
              </svg>
              <div className="[&>a]:ml-2">
                {
                  post.categories.map(v => (<Link href={`/categories#${v}`} key={v}>{v}</Link>))
                }
              </div>
            </div>
          )
          : null
      }
      {
        post.tags.length > 0 ?
          (
            <div className="flex items-center">
              <svg width={16} height={16}>
                <use xlinkHref={Icons.TAG}/>
              </svg>
              <div className="[&>a]:ml-2">
                {
                  post.tags.map(v => (<Link href={`/tags#${v}`} key={v}>{v}</Link>))
                }
              </div>
            </div>
          )
          : null
      }
    </div>
  )
}

export default PostMetadata