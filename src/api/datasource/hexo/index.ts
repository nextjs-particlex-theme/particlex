import Hexo from 'hexo'
import type { BlogDataSource, Resource } from '@/api/datasource/types'
import { Post, StaticResource } from '@/api/datasource/types'
import reactParse, { Element, Text } from 'html-react-parser'
import React from 'react'
import PartialCodeBlock from '@/components/PartialCodeBlock'
import hljs from 'highlight.js'
import type Document from 'warehouse/dist/document'
import path from 'node:path'
import { generateShallowToc } from '@/api/datasource/util'

declare global {
  // eslint-disable-next-line no-unused-vars
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
 * 直接让 highlight.js 自动高冷渲染太慢了，必须主动指定语言，这里为了防止一些简写或者某些特定的语言，设置一些回退选项
 */
const LANGUAGE_MAPPING_FALLBACK: Record<string, string | undefined> = {
  vue: 'html',
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash'
}

/**
 * 高亮一段可能包含代码块的代码.
 * @param html 可能html内容
 */
const highlight = (html: string): React.ReactNode => {
  return reactParse(html, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === 'pre' && domNode.children.length === 1) {
        const ele = domNode.children[0]
        if (ele instanceof Element) {
          const text = ele.childNodes[0]
          if (text instanceof Text) {
            const lang = ele.attribs['class'] ?? 'plaintext'
            const fb = LANGUAGE_MAPPING_FALLBACK[lang]
            const langSubset = fb ? [lang, fb] : [lang]

            const lighted = hljs.highlightAuto(text.data, langSubset).value
            return React.createElement(PartialCodeBlock, { content: lighted, lang })
          }
        }
      }
    }
  })
}

async function queryAllPosts() {
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
    returnVal.push(hexoPostToTypedPost(v))
  })
  return returnVal
}

/**
 * 将 hexo 的 Post 转化为具有完整类型声明的 Post
 */
function hexoPostToTypedPost(v: Document<any>): Post {
  let source = v.source as string
  if (source.endsWith('.md')) {
    source = source.substring(0, source.length - 3)
  }
  if (source.startsWith('_post')) {
    source = source.substring('_post/*'.length)
  }
  return new Post({
    id: v._id ?? `${Date.now()}${Math.floor(Math.random() * 10)}`,
    title: v.title,
    content: highlight(v.content),
    date: v.date,
    slug: v.slug,
    categories: v.categories ? v.categories.data : [],
    tags: v.tags ? v.tags.data : [],
    source: source,
    toc: generateShallowToc(v.content, nodes => {
      const t = nodes.item(1) as any
      const a = nodes.item(0) as any
      return {
        title: t.data,
        anchor: a.getAttribute('href') ?? t.data
      }
    })
  })
}

/**
 * 将 hexo 静态资源转换成有完整类型声明的 StaticResource
 */
function hexoAssertToStaticResource(v: Document<any>): StaticResource {
  return new StaticResource(path.resolve(process.env.HEXO_ABSOLUTE_PATH, <string>v._id), v.path)
}

class HexoDataSource implements BlogDataSource {

  constructor() {}

  async getConfig() {
    const { config } = await getHexoInstance()
    return {
      title: config.title,
      author: config.author,
      description: config.description,
      subtitle: config.subtitle,
      indexPageSize: config.theme_config.indexPageSize ?? 5,
      background: config.theme_config.background ?? [],
      avatar: config.avatar,
      homePage: config.authorHome ?? '#',
    }
  }
  /**
   * 获取所有文章. 仅会获取 `source/_posts` 目录中的内容
   */
  async pageHomePosts(page = 0, size = 5) {
    const returnVal = await queryAllPosts()
    // TODO 考虑做真分页
    const head = page * size

    if (head >= returnVal.length) {
      return []
    }
    return returnVal.slice(head, Math.min(head + size, returnVal.length))
  }
  async pagePostsSize() {
    return (await queryAllPosts()).length
  }
  async getAllPost(): Promise<Record<string, Post>> {
    const hexo = await getHexoInstance()

    const r: Record<string, Post> = {}
    hexo.model('Page').find({}).toArray().map(hexoPostToTypedPost).forEach(v => {
      r[v.source] = v
    })
    const homePost = await queryAllPosts()
    homePost.forEach(v => {
      r[v.source] = v
    })
    return r
  }
  async getAllStaticResource(): Promise<Record<string, StaticResource>> {
    const hexo = await getHexoInstance()
    const resources = hexo.model('Asset').find({}).toArray().filter(v => {
      if (v._id && typeof v._id === 'string') {
        return v._id.startsWith('source/images')
      }
      return false
    }).map(hexoAssertToStaticResource)
    const r: Record<string, StaticResource> = {}
    
    const remove = 'image/*'
    resources.forEach(v => {
      r[v.accessPath.substring(remove.length)] = v
    })
    return r
  }
  async getAllResource(): Promise<Record<string, Resource>> {
    return {
      ...(await this.getAllPost()),
      ...(await this.getAllStaticResource())
    }
  }
}

const hexo = new HexoDataSource()

export default hexo