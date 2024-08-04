import { JSDOM } from 'jsdom'
import showdown from 'showdown'
import type React from 'react'
import processPostContent from '@/api/datasource/html-content-process'
import type { TocItem } from '@/api/datasource/types/definitions'

const LEVEL_MAPPING: Record<string, number> = {
  H1: 0,
  H2: 1,
  H3: 2,
  H4: 3,
  H5: 4,
  H6: 5,
}


// eslint-disable-next-line no-undef
type TitleCaster = (heading: HTMLHeadingElement) => Omit<TocItem, 'child'>

/**
 * 如果使用 {@link markdownToHtml} 生成 html 内容，则可使用该方法来生成 TOC
 */
export const utilMarkdownGenerateCaster: TitleCaster = (heading) => {
  return {
    title: heading.innerHTML,
    anchor: '#' + heading.getAttribute('id')
  }
}

/**
 * 根据 html 自动生成 Toc，要求必须平铺 h1 h2 等标签。
 * @see [/__tests__/api/util.test.ts](/__tests__/api/util.test.ts)
 */
export function generateShallowToc(html?: string, caster?: TitleCaster): TocItem[] {
  if (!html) {
    return []
  }
  const dom = new JSDOM(html, { contentType: 'text/html' })

  const root = dom.window.document.body

  let parentStack: TocItem[] = [{ title: 'FakeRoot', child: [], anchor: '#' }]
  root.childNodes.forEach(v => {
    const currentLevel = LEVEL_MAPPING[v.nodeName]
    if (currentLevel === undefined) {
      return
    }
    const heading = v as HTMLHeadingElement
    if (parentStack[currentLevel]) {
      // 父节点存在
      // 弹出多余节点
      for (let i = currentLevel + 1; i < parentStack.length; i++) {
        parentStack.pop()
      }
      let item: TocItem
      if (caster) {
        const data = caster(heading)
        item = {
          ...data,
          child: []
        }
      } else {
        item = {
          title: heading.innerHTML,
          anchor: '#' + heading.innerHTML,
          child: []
        }
      }

      parentStack[currentLevel].child.push(item)
      parentStack[currentLevel + 1] = item
    }
    // FIXME 如何处理? 父节点不存在，例如 h1 里面 套了个 h3.
  })
  return parentStack[0].child
}

/**
 * markdown 转 html
 */
export const markdownToHtml = (markdownContent: string): string => {
  const sd = new showdown.Converter({
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    // rawPrefixHeaderId: true,
    rawHeaderId: true
  })
  return sd.makeHtml(markdownContent)
}

/**
 * 高亮一段可能包含代码块的代码.
 * @param html 可能html内容
 * @deprecated
 */
export const highlight = (html: string): React.ReactNode => {
  return processPostContent(html)
}

const YAML_INDEX_SPACES_FILL: string = (new Array(Number.parseInt(process.env.YAML_INDENT_SPACE_COUNT, 10))).map(() => ' ').join('')

/**
 * 将 `\t` 替换为 `两个空格`.<p>
 * 用于处理 yaml 中使用了 `\t` 作为缩进的问题
 * @param str
 */
export const replacePrefixIndent = (str: string): string => {
  let i = 0
  while (i < str.length && str.charAt(i) === '\t') {
    i++
  }
  if (i === str.length) {
    return ''
  }
  if (i === 0) {
    return str
  }
  const spaces: string[] = []
  for (let j = 0; j < i; j++) {
    spaces.push(YAML_INDEX_SPACES_FILL)
  }
  return spaces.join('') + str.substring(i)
}