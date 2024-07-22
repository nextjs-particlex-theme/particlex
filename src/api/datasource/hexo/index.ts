import Hexo from 'hexo'
import { BlogDataSource, Config, Post } from '@/api/datasource/types'
import reactParse, { Element, Text } from 'html-react-parser'
import React from 'react'
import PartialCodeBlock from '@/components/PartialCodeBlock'
import hljs from 'highlight.js'


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
 * 高亮一段可能包含代码块的代码.
 * @param html 可能html内容
 */
const highlight = (html: string): React.ReactNode => {
  return reactParse(html, {
    replace: (domNode, index) => {
      if (domNode instanceof Element && domNode.tagName === 'pre' && domNode.children.length === 1) {
        const ele = domNode.children[0]
        if (ele instanceof Element) {
          const text = ele.childNodes[0]
          if (text instanceof Text) {
            const lang = ele.attribs['class'] ?? 'plaintext'
            const lighted = hljs.highlightAuto(text.data, [lang]).value
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
    returnVal.push({
      _id: v._id ?? `${Date.now()}${Math.floor(Math.random() * 10)}`,
      title: v.title,
      content: highlight(v.content),
      date: v.date,
      slug: v.slug,
      categories: v.categories.toArray(),
      tags: v.tags.toArray(),
      source: source
    })
  })
  return returnVal
}

const hexo: BlogDataSource = {
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
    }
  },
  /**
   * 获取所有文章. 仅会获取 `source/_posts` 目录中的内容
   */
  async pagePosts(page = 0, size = 5) {
    const returnVal = await queryAllPosts()
    // TODO 考虑做真分页
    const head = page * size

    if (head >= returnVal.length) {
      return []
    }
    return returnVal.slice(head, Math.min(head + size, returnVal.length))
  },
  async pagePostsSize() {
    return (await queryAllPosts()).length
  }
}

export default hexo