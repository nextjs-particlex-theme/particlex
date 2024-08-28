import fs from 'node:fs'
import yaml, { YAMLParseError } from 'yaml'
import showdown from 'showdown'
import type { TocItem } from '@/api/datasource/types/definitions'
import { JSDOM } from 'jsdom'
import * as os from 'node:os'


showdown.setFlavor('github')

export type PostContent = {
  metadata: {
    title?: string
    date?: string
    categories?: string | string[]
    tags?: string | string[]
    seo?: {
      title?: string
      description?: string
      keywords?: string | string[]
    }
  }
  content: string
  toc: TocItem[]
}

const LEVEL_MAPPING: Record<string, number> = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
}

type WrappedTocItem = {
  item: TocItem
  actualLevel: number
}

/**
 * 根据 html 自动生成 Toc. 当碰到不连贯的标题时，例如 h1 里面直接套 h3，此时 h3 会被直接认作子标题
 */
function generateShallowToc(html?: string): TocItem[] {
  if (!html) {
    return []
  }
  const dom = new JSDOM(html, { contentType: 'text/html' })

  const root = dom.window.document.body

  let parentStack: WrappedTocItem[] = [{ item: { title: 'FakeRoot', child: [], anchor: '#' }, actualLevel: -1 }]

  root.childNodes.forEach(v => {
    const currentLevel = LEVEL_MAPPING[v.nodeName]
    if (currentLevel === undefined) {
      return
    }
    const heading = v as HTMLHeadingElement
    const data = {
      title: heading.innerHTML,
      anchor: '#' + heading.getAttribute('id')
    }
    const item: WrappedTocItem = {
      item: {
        ...data,
        child: []
      },
      actualLevel: currentLevel,
    }
    for (let i = parentStack.length - 1; i >= 0; --i) {
      const cur = parentStack[i]
      if (cur.actualLevel < item.actualLevel) {
        // remaining child
        cur.item.child.push(item.item)
        parentStack.push(item)
        break
      } else {
        parentStack.pop()
      }
    }
  })
  return parentStack[0].item.child
}

let __test_generateShallowToc0: typeof generateShallowToc | undefined
if (process.env.NODE_ENV === 'test') {
  __test_generateShallowToc0 = generateShallowToc
} else {
  __test_generateShallowToc0 = undefined
}

/**
 * Test only
 */
export const __test_generateShallowToc = __test_generateShallowToc0




const YAML_INDEX_SPACES_FILL: string = (new Array(Number.parseInt(process.env.YAML_INDENT_SPACE_COUNT, 10))).map(() => ' ').join('')

/**
 * 将 `\t` 替换为 `两个空格`.<p>
 * 用于处理 yaml 中使用了 `\t` 作为缩进的问题
 * @param str
 */
const replacePrefixIndent = (str: string): string => {
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

const REPLACE_REGX = /^\t+/g

/**
 * 创建一个错误，指出哪里使用了 TAB
 */
function indicateWhereContainsTab(yamlLines: string[], filePath: string): Error {
  let msg: string[] = [`Failed to parse YAML in the markdown file '${filePath}'. The lines below start with a TAB (TABs are replaced by a '→'):`]
  for (let i = 0; i < yamlLines.length; i++) {
    const line = yamlLines[i]
    if (line.startsWith('\t')) {
      msg.push(`\tLine ${i + 1}, content: ${line.replaceAll(REPLACE_REGX, '→')}`)
    }
  }
  msg.push('\nYou can either replace them with spaces or modify the environment variable \'YAML_INDENT_SPACE_COUNT\' to fix it automatically.')
  return new Error(msg.join('\n'))
}

/**
 * markdown 转 html
 */
const markdownToHtml = (markdownContent: string): string => {
  const sd = new showdown.Converter({
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    headerLevelStart: 1,
    rawHeaderId: true
  })
  return sd.makeHtml(markdownContent)
}

enum CollectStatus {
  EXPECT_START,
  EXPECT_END,
  DONE
}

/**
 * 解析 Markdown 文本内容
 * @param content Markdown内容，提供一个以换行符分割的数组或者整个字符串，后者将会被转化为前者
 * @param filepath 文件路径，当解析 markdown 错误时，将会带上文件路径以便于排查
 */
export const parseMarkdownContent = (content: string[] | string, filepath: string = '<Unknown>'): PostContent => {
  const metadataStrArr: string[] = []
  let metadataCollectStatus = CollectStatus.EXPECT_START
  let contentArr: string[] = Array.isArray(content) ? content : content.split(os.EOL)

  for (let line of contentArr) {
    if (metadataCollectStatus == CollectStatus.DONE) {
      break
    }
    switch (metadataCollectStatus) {
    case CollectStatus.EXPECT_START: {
      if (line.startsWith('---')) {
        metadataCollectStatus = CollectStatus.EXPECT_END
      }
      break
    }
    case CollectStatus.EXPECT_END: {
      if (line.startsWith('---')) {
        metadataCollectStatus = CollectStatus.DONE
        break
      }
      metadataStrArr.push(line)
      break
    }
    // eslint-disable-next-line no-fallthrough
    default: 
      throw new Error('Unreachable branch!')
    }
  }
  

  if (metadataCollectStatus !== CollectStatus.DONE) {
    // no metadata provided.
    const html = markdownToHtml(Array.isArray(content) ? content.join(os.EOL) : content)
    return {
      content: html,
      toc: generateShallowToc(html),
      metadata: {}
    }
  }

  let metadata: PostContent['metadata']
  try {
    metadata = yaml.parse(metadataStrArr.join('\n'))
  } catch (e) {
    if (e instanceof YAMLParseError && e.code === 'TAB_AS_INDENT') {
      const str = metadataStrArr.map(replacePrefixIndent).join('\n')
      try {
        metadata = yaml.parse(str)
      } catch (e) {
        throw indicateWhereContainsTab(metadataStrArr, filepath)
      }
    } else {
      throw new Error(`Parse yaml file '${filepath}' failed, content:\n${metadataStrArr.join(os.EOL)}`, { cause: e })
    }
  }
  const html = markdownToHtml(contentArr.slice(metadataStrArr.length + 2).join(os.EOL))
  return {
    content: html,
    metadata,
    toc: generateShallowToc(html)
  }
  
}

/**
 * 解析 markdown 文件
 * @param filepath 文件路径
 */
export const parseMarkdownFile = (filepath: string): PostContent => {
  const content = fs.readFileSync(filepath, { encoding: 'utf-8' })
  return parseMarkdownContent(content, filepath)
}