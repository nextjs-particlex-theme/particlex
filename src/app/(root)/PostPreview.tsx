import { Post } from '@/api/datasource/types'
import React from 'react'
import Link from 'next/link'
import styles from './root-style.module.scss'
import postStyle from '@/components/post.module.scss'
import { Icons } from '@/app/svg-symbols'

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
          <Link href={post.source} className="text-2xl font-bold">{post.title}</Link>
        </div>
        <div className="flex [&>div]:mr-6 text-subtext">
          <div>
            {
              post.categories.length > 0 ?
                (
                  <div className="[&>span]:ml-2 flex">
                    <svg width={16} height={16}>
                      <use xlinkHref={Icons.BOX_ARCHIVE}/>
                    </svg>
                    {/*<FontAwesomeIcon icon={faBoxArchive} width="1rem"/>*/}
                    {
                      post.categories.map(v => (<Link href={v.path} key={v.name}>{v.name}</Link>))
                    }
                  </div>
                )
                : null
            }
          </div>
          <div className="flex">
            <svg width={16} height={16}><use xlinkHref={Icons.CALENDAR}/></svg>
            <span className="ml-2">{post.formattedTime}</span>
          </div>
        </div>
      </div>
      <div className={`${postStyle.postContainer} link-styled-container`}>
        {post.content}
      </div>
      <div className={styles.postCover}>
        <Link href={post.source}>
          阅读全文
        </Link>
      </div>
    </div>
  )
}

export default PostPreview