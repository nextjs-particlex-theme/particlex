import React from 'react'
import Link from 'next/link'
import styles from './root-style.module.scss'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'
import type Post from '@/api/datasource/types/resource/Post'
import PostContainer from '@/components/PostContainer'
import { concatClassName } from '@/lib/DomUtils'

interface PostPreviewProps {
  post: Post
}

const PostPreview:React.FC<PostPreviewProps> = props => {
  const { post } = props
  return (
    <PostContainer
      className="bg-card rounded-3xl shadow-lg  mt-[2rem]">
      <div className="flex flex-col items-center mb-8">
        <div className="p-8 link-styled-container">
          <Link href={post.getAccessPath()} className="text-2xl font-bold">{post.title}</Link>
        </div>
        <PostMetadata post={post}/>
      </div>
      <div className={styles.postCover}>
        <Link href={post.getAccessPath()} className={concatClassName('absolute bottom-0 right-0', styles.readAll)}>
          阅读全文
        </Link>
      </div>
      <div className={concatClassName(postStyle.postContainer, 'link-styled-container max-h-[64rem]')}>
        {post.content}
      </div>
    </PostContainer>
  )
}

export default PostPreview