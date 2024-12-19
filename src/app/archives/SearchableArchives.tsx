'use client'
import React, { useEffect, useRef } from 'react'
import styles from './archive.module.scss'
import Link from 'next/link'
import PostMetadata from '@/components/PostMetadata'
import type { ClientSafePost } from '@/api/datasource/types/Post'
import type { FuseResult } from 'fuse.js'
import Fuse from 'fuse.js'


type HighlightKeywordProps = {
  item: FuseResult<ClientSafePost>
  expectedKey: keyof ClientSafePost
}

const HighlightKeyword:React.FC<HighlightKeywordProps> = props => {
  if (!props.item.matches) {
    return <span>{props.item.item[props.expectedKey]}</span>
  }
  const match = props.item.matches.find(v => v.key === props.expectedKey)
  if (!match || !match.value) {
    return <span>{props.item.item[props.expectedKey]}</span>
  }
  const elements: React.ReactNode[] = []
  let lastR = 0
  for (const index of match.indices) {
    const l = index[0]
    if (l > 0) {
      elements.push(match.value.substring(lastR, l))
    }
    lastR = index[1] + 1
    elements.push(<span className="text-primary">{match.value.substring(l, lastR)}</span>)
  }
  if (lastR < match.value.length) {
    elements.push(match.value.substring(lastR))
  }
  
  return (
    <span>
      { elements.map(v => v) }
    </span>
  )
}

const ArchiveItem: React.FC<{post: FuseResult<ClientSafePost>, style?: React.CSSProperties}> = ({ post, style }) => {
  return (
    <div className={styles.timeline}>
      <div className="top-0 w-full" style={style}>
        <div className={styles.timelineTail}/>
        <div className={styles.timelineContent}>
          <div className="text-subtext">{post.item.formattedTime}</div>
          <Link href={post.item.source} className="text-2xl font-bold mt-2.5 mb-2.5">
            <HighlightKeyword item={post} expectedKey="title"/>
          </Link>
          <PostMetadata post={post.item} hideDate/>
        </div>
      </div>
    </div>
  )
}


interface SearchableArchivesProps {
  posts: ClientSafePost[]
}

/**
 * 提供搜索功能.
 *
 * 动画构想:
 *
 * 搜索到结果后，所有
 */
const SearchableArchives: React.FC<SearchableArchivesProps> = props => {
  const [archives, setArchives] = React.useState<FuseResult<ClientSafePost>[]>(() => 
    props.posts.map((v, i) => ({ item: v, refIndex: i }))
  )
  const lastSearchTimeout = useRef<ReturnType<typeof setTimeout>>()
  const fuse = useRef<Fuse<ClientSafePost>>()

  useEffect(() => {
    fuse.current = new Fuse(props.posts, {
      keys: ['title', 'categories', 'tags'],
      includeMatches: true
    })
  }, [props.posts])

  const onInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const f = fuse.current!
    if (lastSearchTimeout.current) {
      clearTimeout(lastSearchTimeout.current)
    }
    const value = e.currentTarget.value
    lastSearchTimeout.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (value.length === 0) {
          setArchives(props.posts.map((v, i) => ({ item: v, refIndex: i })))
        } else {
          setArchives(f.search(value))
        }
      })
    }, 100)
  }

  return (
    <div>
      <input className={styles.searchBar} placeholder="搜索" onInput={onInput}/>
      <div className="relative" >
        {
          archives.map((p) => (
            <ArchiveItem  key={p.item.id} post={p} />
          ))
        }
      </div>
    </div>
  )
}

export default SearchableArchives