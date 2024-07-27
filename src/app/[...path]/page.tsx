import datasource from '@/api/datasource'
import React from 'react'
import Header from '@/components/Header'
import { Metadata } from 'next'
import { Post } from '@/api/datasource/types'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'

export async function generateStaticParams(): Promise<Param[]> {
  const posts = await datasource.getAllPost()
  return Object.values(posts).map(v => ({
    path: v.getAccessPath().split('/')
  }))
}

export async function generateMetadata({ params }: {params: Param}): Promise<Metadata> {
  const config = await datasource.getAllPost()
  const post = config[params.path.join('/')] as Post

  return {
    title: post.title
  }
}

interface Param {
  path: string[]
}

const PostPage: React.FC<{params: Param}> = async ({ params }) => {
  const post = (await datasource.getAllPost())[params.path.join('/')]
  const meta = await datasource.getConfig()
  return (
    <div>
      <Header title={meta.title}/>
      <div className="w-[56rem] rounded-3xl pt-40 pb-40 p-12 box-border overflow-hidden relative m-auto">
        <div className="text-3xl font-bold">
          {post.title}
        </div>
        <PostMetadata post={post} className="mt-4 mb-12"/>
        <div className={`${postStyle.postContainer} link-styled-container`}>
          { post.content }
        </div>
      </div>
    </div>
  )
}

export default PostPage