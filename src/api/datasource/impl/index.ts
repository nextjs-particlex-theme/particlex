import * as fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import AbstractMarkdownBlogDataSource from '@/api/datasource/AbstractMarkdownBlogDataSource'
import type { DataSourceConfig } from '@/api/datasource/types/definitions'


class MarkdownDatasource extends AbstractMarkdownBlogDataSource {

  private readonly rootPathPrefixes: string[]

  constructor() {
    super({
      homePostDirectory: process.env.BLOG_HOME_POST_DIRECTORY,
      resourceDirectory: process.env.BLOG_RESOURCE_DIRECTORY,
      postDirectory: process.env.BLOG_POST_DIRECTORY
    })
    this.rootPathPrefixes = path.normalize(process.env.BLOG_HOME_POST_DIRECTORY).split(path.sep)
  }

  resolvePostWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    if (sp[sp.length - 1].endsWith('.md')) {
      const t = sp[sp.length - 1]
      sp[sp.length - 1] = t.substring(0, t.length - 3)
    }
    let head = 0
    while (head < sp.length && sp[head] == this.rootPathPrefixes[head]) {
      head++
    }
    return sp.slice(head)
  }
  resolveStaticResourceWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    return sp.slice(1)
  }

  getConfig(): Promise<DataSourceConfig> {
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
      avatar: theme.avatar ?? '',
      favicon: theme.favicon
    })
  }
}

const instance = new MarkdownDatasource()
export default instance