import type { Config } from '@/api/datasource/types'
import * as fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import AbstractMarkdownBlogDataSource from '@/api/datasource/AbstractMarkdownBlogDataSource'


class HexoDatasource extends AbstractMarkdownBlogDataSource {

  constructor() {
    super({
      homePostDirectory: 'source/_posts',
      resourceDirectory: 'source/images',
      postDirectory: 'source'
    })
  }

  resolvePostWebPath(path: string): string {
    let source = path.substring(path.indexOf('source/_posts/') + 'source/_posts/'.length + 1)
    return source.substring(0, source.length - 3)
  }
  resolveStaticResourceWebPath(path: string): string {
    return path.substring('source/*'.length)
  }

  getConfig(): Promise<Config> {
    let configFile
    if (!fs.existsSync((configFile = path.resolve(process.env.BLOG_PATH, '_config.yml'))) && !fs.existsSync((configFile = path.resolve(process.env.BLOG_PATH, '_config.yaml')))) {
      throw new Error('Could not find config file from both _config.yml and _config.yaml')
    }
    const parsed = yaml.parse(fs.readFileSync(configFile, { encoding: 'utf8' }))

    const theme = parsed.theme_config ?? {}

    return Promise.resolve({
      title: parsed.title,
      subtitle: parsed.subtitle,
      description: parsed.description,
      author: parsed.author,
      homePage: parsed.authorHome ?? '#',
      indexPageSize: theme.indexPageSize ?? 5,
      background: theme.background ?? [],
      avatar: theme.avatar ?? ''
    })
  }
}

const instance = new HexoDatasource()
export default instance