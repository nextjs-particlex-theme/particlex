'use client'
import React, { useEffect, useRef } from 'react'
import type { ClientSafePost } from '@/api/datasource/types'
import styles from './archive.module.scss'
import Link from 'next/link'
import PostMetadata from '@/components/PostMetadata'


const ArchiveItem: React.FC<{post: ClientSafePost}> = ({ post }) => {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineTail}/>
      <div className={styles.timelineContent}>
        <div className="text-subtext">{post.formattedTime}</div>
        <Link href={post.source} className="text-2xl font-bold mt-2.5 mb-2.5">{post.title}</Link>
        <PostMetadata post={post} hideDate/>
      </div>
    </div>
  )
} 


interface SearchableArchivesProps {
  posts: ClientSafePost[]
}

const SearchableArchives: React.FC<SearchableArchivesProps> = props => {
  const loverCaseTitles = useRef<string[]>([])
  const [archives, setArchives] = React.useState<ClientSafePost[]>(props.posts)
  const lastSearchTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    loverCaseTitles.current = props.posts.map(v => v.title.toLowerCase())
  }, [props.posts])

  const onInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    if (lastSearchTimeout.current) {
      clearTimeout(lastSearchTimeout.current)
    }
    const value = e.currentTarget.value.toLowerCase()
    lastSearchTimeout.current = setTimeout(() => {
      const result: ClientSafePost[] = []
      for (let i = 0; i < loverCaseTitles.current.length; i++) {
        if (loverCaseTitles.current[i].includes(value)) {
          result.push(props.posts[i])
        }
      }
      setArchives(result)
    }, 100)
  }
  
  return (
    <div>
      <input className={styles.searchBar} placeholder="搜索" onInput={onInput}/>
      {
        archives.map(p => (
          <ArchiveItem key={p.id} post={p} />
        ))
      }
    </div>
  )
}

export default SearchableArchives