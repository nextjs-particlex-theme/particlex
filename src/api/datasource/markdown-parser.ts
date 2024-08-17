import readline from 'node:readline'
import fs from 'node:fs'
import yaml, { YAMLParseError } from 'yaml'
import showdown from 'showdown'
import type { TocItem } from '@/api/datasource/types/definitions'
import { JSDOM } from 'jsdom'


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
  H1: 0,
  H2: 1,
  H3: 2,
  H4: 3,
  H5: 4,
  H6: 5,
}


/**
 * 根据 html 自动生成 Toc，要求必须平铺 h1 h2 等标签。
 * @see [/__tests__/api/util.test.ts](/__tests__/api/util.test.ts)
 */
function generateShallowToc(html?: string): TocItem[] {
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
      const data = {
        title: heading.innerHTML,
        anchor: '#' + heading.getAttribute('id')
      }
      item = {
        ...data,
        child: []
      }

      parentStack[currentLevel].child.push(item)
      parentStack[currentLevel + 1] = item
    }
  })
  return parentStack[0].child
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
    // rawPrefixHeaderId: true,
    rawHeaderId: true
  })
  return sd.makeHtml(markdownContent)
}

/**
 * 解析 markdown 文件
 * @param filepath 文件路径
 */
export const parseMarkdownFile = (filepath: string): Promise<PostContent> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filepath),
    })
    const metadataStrArr: string[] = []
    // 0: expect start.
    // 1: expect end.
    // 2: collected.
    let metadataCollectStatus = 0
    const content: string[] = []

    rl.on('line', (line) => {
      if (metadataCollectStatus < 2) {
        metadataStrArr.push(line)
        if (line.startsWith('---')) {
          metadataCollectStatus++
        }
      } else {
        content.push(line)
      }
    })

    rl.on('close', () => {
      let metadata: any
      let html: string
      if (metadataCollectStatus < 2) {
        metadata = {}
        html = markdownToHtml(metadataStrArr.join('\n'))
      } else {
        const original = metadataStrArr.slice(1, metadataStrArr.length - 1)
        try {
          metadata = yaml.parse(original.join('\n'))
        } catch (e) {
          if (e instanceof YAMLParseError && e.code === 'TAB_AS_INDENT') {
            const str = metadataStrArr.map(replacePrefixIndent).slice(1, metadataStrArr.length - 1).join('\n')
            try {
              metadata = yaml.parse(str)
            } catch (e) {
              reject(indicateWhereContainsTab(original, filepath))
              return
            }
          } else {
            reject(new Error(`Parse yaml file '${filepath}' failed, content:\n${original.join('\n')}`, { cause: e }))
            return
          }
        }
        html = markdownToHtml(content.join('\n'))
      }
      resolve({
        metadata: metadata ?? {},
        content: html,
        toc: generateShallowToc(html)
      })
    })
  })
}