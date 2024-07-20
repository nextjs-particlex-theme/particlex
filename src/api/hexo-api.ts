import Hexo from "hexo";
import {HexoConfig, Post} from "@/api/hexo-api-types";

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
 * 获取所有文章
 */
export const getAllPostsPaths = async (): Promise<Post[]> => {
  const hexo = await getHexoInstance()
  const data = await hexo.database.model('Post').find({}).sort('-date').toArray()
  return (data as unknown as Post[])
}

/**
 * 获取用户配置
 */
export const getHexoConfig = async (): Promise<HexoConfig> => {
  const hexo = await getHexoInstance()
  return hexo.config as unknown as HexoConfig
}