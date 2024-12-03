'use client'
import React, { useEffect, useRef } from 'react'
import styles from './archive.module.scss'
import Link from 'next/link'
import PostMetadata from '@/components/PostMetadata'
import type { ClientSafePost } from '@/api/datasource/types/resource/Post'
import Fuse from 'fuse.js'


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
  const [archives, setArchives] = React.useState<ClientSafePost[]>(props.posts)
  const lastSearchTimeout = useRef<ReturnType<typeof setTimeout>>()
  const fuse = useRef<Fuse<ClientSafePost>>()
  
  useEffect(() => {
    fuse.current = new Fuse(props.posts, {
      keys: ['title', 'categories', 'tags']
    })
  }, [props.posts])

  const onInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const f = fuse.current!
    if (lastSearchTimeout.current) {
      clearTimeout(lastSearchTimeout.current)
    }
    const value = e.currentTarget.value
    lastSearchTimeout.current = setTimeout(() => {
      if (value.length === 0) {
        setArchives(props.posts)
      } else {
        setArchives(f.search(value).map(i => i.item))
      }
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