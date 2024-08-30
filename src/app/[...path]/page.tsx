import datasource from '@/api/datasource'
import React from 'react'
import Header from '@/components/Header'
import type { Metadata } from 'next'
import postStyle from '@/components/post.module.scss'
import PostMetadata from '@/components/PostMetadata'
import TableOfContent, { MAIN_CONTENT_ID } from '@/components/TableOfContent'
import Link from 'next/link'
import CommentComponentInject from '@/components/CommentComponentInject'
import PostContainer from '@/components/PostContainer'


export async function generateStaticParams(): Promise<Param[]> {
  const posts = await datasource.getAllPost()
  const r: Param[] = posts.map(v => ({ path: v.source }))

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
  const post = await datasource.getPostByWebUrl(params.path)

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
  const post = await datasource.getPostByWebUrl(params.path)

  if (!post) {
    return (
      <div>
        If you see this page, it means you do not have any files in your source/images folder.
        Because of the <Link href="https://github.com/vercel/next.js/issues/61213">limitation of next.js</Link>, we have to create a fallback page.
        But if you have files in source/images and this page still generated, it maybe the bug of the theme.
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