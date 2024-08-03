import React from 'react'
import Link from 'next/link'
import styles from './root-style.module.scss'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'
import type Post from '@/api/datasource/types/resource/Post'

interface PostPreviewProps {
  post: Post
}

const PostPreview:React.FC<PostPreviewProps> = props => {
  const { post } = props
  return (
    <div
      className={`w-[56rem] bg-white rounded-3xl p-12 shadow-lg box-border max-h-[1024px] overflow-hidden relative ${styles.postContainer}`}>
      <div className="flex flex-col items-center mb-8">
        <div className="p-8 link-styled-container">
          <Link href={post.getAccessPath()} className="text-2xl font-bold">{post.title}</Link>
        </div>
        <PostMetadata post={post}/>
      </div>
      <div className={`${postStyle.postContainer} link-styled-container`}>
        {post.content}
      </div>
      <div className={styles.postCover}>
        <Link href={post.getAccessPath()}>
          阅读全文
        </Link>
      </div>
    </div>
  )
}

export default PostPreview