import Hexo from 'hexo'
import { HexoConfig, Post } from '@/api/hexo-api-types'

declare global {
  var __hexo__: Hexo | undefined
}

/**
 * 获取 hexo
 */
const getHexoInstance = async (): Promise<Hexo> => {
  if (global.__hexo__) {
    return global.__hexo__
  }
  const hexo = new Hexo(process.env.HEXO_ABSOLUTE_PATH, {
    silent: true
  })

  await hexo.init()

  await hexo.load()

  global.__hexo__ = hexo
  return hexo
}


/**
 * 获取所有文章. 仅会获取 `source/_posts` 目录中的内容
 */
export const getAllPosts = async (): Promise<Post[]> => {
  const hexo = await getHexoInstance()
  const data = await hexo.database.model('Post').find({}).sort('-date').toArray()
  const returnVal: Post[] = []

  data.forEach(v => {
    const PREFIX = '_posts'
    let source = v.source as string
    if (source.startsWith(PREFIX)) {
      source = source.substring(PREFIX.length)
      const SUFFIX = '.md'
      if (source.endsWith(SUFFIX)) {
        source = source.substring(0, source.length - SUFFIX.length)
      }
    }
    // @ts-ignore
    returnVal.push({
      ...v,
      categories: v.categories.toArray(),
      tags: v.tags.toArray(),
      source: source
    })
  })

  return returnVal.slice(0, 4)
}

/**
 * 获取用户配置
 */
export const getHexoConfig = async (): Promise<HexoConfig> => {
  const hexo = await getHexoInstance()
  return hexo.config as unknown as HexoConfig
}