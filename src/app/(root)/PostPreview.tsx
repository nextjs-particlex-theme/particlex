import { Post } from '@/api/hexo-api-types'
import { faCalendar, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Link from 'next/link'
import '@/lib/highlight'
import PostContent from '@/components/PostContent'
import styles from './root-style.module.scss'

interface PostPreviewProps {
  post: Post
}

const PostPreview:React.FC<PostPreviewProps> = props => {
  const { post } = props
  return (
    <div className={`w-[56rem] bg-white rounded-3xl p-12 shadow-lg box-border max-h-[1024px] overflow-hidden relative ${styles.postContainer}`}>
      <div className="flex flex-col items-center mb-8">
        <div className="p-8 link-styled-container">
          <Link href={post.source} className="text-2xl font-bold">{post.title}</Link>
        </div>
        <div className="flex [&>div]:mr-6 text-subtext">
          <div>
            {
              post.categories.length > 0 ?
                (
                  <Link href="/categories" className="[&>span]:ml-2">
                    <FontAwesomeIcon icon={faBoxArchive} width="1rem"/>
                    {
                      post.categories.map(v => (<span key={v._id}>{v.name}</span>))
                    }
                  </Link>
                )
                : null
            }
          </div>
          <div>
            <FontAwesomeIcon icon={faCalendar} width="1rem"/>
            <span className="ml-2">{post.date.format('YYYY/MM/DD')}</span>
          </div>
        </div>
      </div>
      <PostContent html={post.content} />
      <div className={styles.postCover}>
        <Link href={post.source}>
          阅读全文
        </Link>
      </div>
    </div>
  )
}

export default PostPreview