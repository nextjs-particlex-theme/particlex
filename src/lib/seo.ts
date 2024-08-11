import type Post from '@/api/datasource/types/resource/Post'
import type { Metadata } from 'next'
import datasource from '@/api/datasource'

export const generateSeoMetadata = async (post: Post): Promise<Metadata> => {
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