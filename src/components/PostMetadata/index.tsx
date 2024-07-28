import React from 'react'
import type { ClientSafePost, Post } from '@/api/datasource/types'
import { Icons } from '@/app/svg-symbols'
import Link from 'next/link'

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
    <div className={`flex [&>div]:mr-6 text-subtext ${className}`}>
      {
        post.categories.length > 0 ?
          (
            <div className="[&>span]:ml-2 flex">
              <svg width={16} height={16}>
                <use xlinkHref={Icons.BOOKMARK}/>
              </svg>
              {
                post.categories.map(v => (<Link href={v.path} key={v.name}>{v.name}</Link>))
              }
            </div>
          )
          : null
      }
      { hideDate ? 
        null :
        <div className="flex">
          <svg width={16} height={16}>
            <use xlinkHref={Icons.CALENDAR}/>
          </svg>
          <span className="ml-2">{post.formattedTime}</span>
        </div>
      }
    </div>
  )
}

export default PostMetadata