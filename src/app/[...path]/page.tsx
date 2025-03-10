import React from 'react'
import Header from '@/components/Header'
import type { Metadata } from 'next'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'
import TableOfContent, { MAIN_CONTENT_ID } from '@/components/TableOfContent'
import CommentComponentInject from '@/components/CommentComponentInject'
import PostContainer from '@/components/PostContainer'
import ServiceBeans from '@/api/svc/ServiceBeans'


export async function generateStaticParams(): Promise<Param[]> {
  const posts = ServiceBeans.blogService.getAllPagesUrl()
  const r: Param[] = posts.map(v => ({ path: v.metadata.visitPath }))

  if (r.length > 0) {
    return r
  }
  return [
    {
      path: ['post', 'fallback']
    }
  ]
}

export async function generateMetadata(props: {params: Promise<Param>}): Promise<Metadata> {
  const params = await props.params
  const service = ServiceBeans.blogService
  const post = await service.getPageByWebUrl(params.path)

  if (!post) {
    return {
      title: 'Fallback Page'
    }
  }
  const config = service.getConfig()
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

const PostPage: React.FC<{params: Promise<Param>}> = async props => {
  const params = await props.params
  const post = await ServiceBeans.blogService.getPageByWebUrl(params.path)

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
        <TableOfContent />
        <CommentComponentInject/>
      </PostContainer>
    </div>
  )
}

export default PostPage