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

  resolvePostWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    if (sp[sp.length - 1].endsWith('.md')) {
      const t = sp[sp.length - 1]
      sp[sp.length - 1] = t.substring(0, t.length - 3)
    }
    if (sp[1] === '_posts') {
      return sp.slice(2)
    } else {
      return sp.slice(1)
    }
  }
  resolveStaticResourceWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    return sp.slice(1)
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