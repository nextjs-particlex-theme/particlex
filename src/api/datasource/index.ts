import type { HexoBasePageMetadata } from 'blog-helper'
import { HexoDatasource } from 'blog-helper'


export type ParticlexPageMetadata = {
  date?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string | string[]
  }
} & HexoBasePageMetadata

const hexo = new HexoDatasource<ParticlexPageMetadata>({
  pageDirectory: process.env.BLOG_POST_DIRECTORY,
  homePageDirectory: process.env.BLOG_HOME_POST_DIRECTORY,
  rootDirectory: process.env.BLOG_PATH,
  staticResourceDirectory: process.env.RESOURCE_DIRECTORY ?? 'source/static',
})
export default hexo
