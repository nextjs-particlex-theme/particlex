import type Post from '@/api/datasource/types/resource/Post'
import type { Metadata } from 'next'
import datasource from '@/api/datasource'

export const generateSeoMetadata = async (post: Post): Promise<Metadata> => {
  const config = await datasource.getConfig()
  const { seo } = post

  const title = seo.title.includes('|') ? seo.title : `${seo.title} | ${config.title}`

  return {
    title,
    description: seo.description,
    keywords: seo.keywords
  }
}