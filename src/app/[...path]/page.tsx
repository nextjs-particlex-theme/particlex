import datasource from '@/api/datasource'
import React from 'react'
import Header from '@/components/Header'
import type { Metadata } from 'next'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'
import TableOfContent, { MAIN_CONTENT_ID } from '@/components/TableOfContent'
import CommentComponentInject from '@/components/CommentComponentInject'
import PostContainer from '@/components/PostContainer'


export async function generateStaticParams(): Promise<Param[]> {
  const posts = await datasource.getAllPagesUrl()
  const r: Param[] = posts.map(v => ({ path: v.visitPath }))

  console.log(r)
  console.log('==')
  if (r.length > 0) {
    return r
  }
  return [
    {
      path: ['post', 'fallback']
    }
  ]
}

export async function generateMetadata({ params }: {params: Param}): Promise<Metadata> {
  const post = await datasource.getPageByWebUrl(params.path)

  if (!post) {
    return {
      title: 'Fallback Page'
    }
  }
  const config = await datasource.getConfig()
  const { seo } = post

  let title: string
  if (seo.title) {
    if (seo.title.includes('|')) {
      title = seo.title
    } else {
      title = `${seo.title} | ${config.title}`
    }
  } else {
    title = `${post.title} | ${config.title}`
  }

  return {
    title,
    description: seo.description,
    keywords: seo.keywords
  }
}

interface Param {
  path: string[]
}

const PostPage: React.FC<{params: Param}> = async ({ params }) => {
  const post = await datasource.getPageByWebUrl(params.path)

  if (!post) {
    return (
      <div>
        Can not find any pages in the specified directory. If you do have it, please post an issue on GitHub to help resolve this problem.
      </div>
    )
  }
  return (
    <div>
      <Header/>
      <PostContainer id="container" className="fade-in">
        <h1 className="text-3xl font-bold">
          {post.title}
        </h1>
        <PostMetadata post={post} className="mt-4 mb-12"/>
        <div className={`${postStyle.postContainer} link-styled-container`} id={MAIN_CONTENT_ID}>
          { post.content }
        </div>
        <TableOfContent tocItems={post.toc}/>
        <CommentComponentInject/>
      </PostContainer>
    </div>
  )
}

export default PostPage