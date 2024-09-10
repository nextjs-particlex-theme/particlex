import mdParser from '@/api/markdown-parser/impl/md/MdParser'
import mdxParser from '@/api/markdown-parser/impl/mdx/MdxParser'
import type { ParsedMarkdown } from '@/api/markdown-parser/types'
import os from 'node:os'
import yaml, { YAMLParseError } from 'yaml'

/**
 * 解析markdown文本内容
 * @param markdown markdown 文本内容
 * @param identifier 标识符，md或mdx
 */
const parseMarkdown = (markdown: string, identifier: string): Promise<ParsedMarkdown> => {
  if (identifier.endsWith('.md')) {
    return mdParser.parse(markdown)
  } else if (identifier.endsWith('.mdx')) {
    // TODO error handle.
    return mdxParser.parse(markdown)
  } else {
    throw new Error('Unknown file.')
  }
}

export type Markdown = {
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
}

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



enum CollectStatus {
  EXPECT_START,
  EXPECT_END,
  DONE
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
 * 解析 Markdown 文本内容
 * @param content Markdown内容，提供一个以换行符分割的数组或者整个字符串，后者将会被转化为前者
 * @param filepath 文件路径，当解析 markdown 错误时，将会带上文件路径以便于排查
 */
export const splitMarkdownContent = (content: string[] | string, filepath: string = '<Unknown>'): Markdown => {
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
    return {
      content: Array.isArray(content) ? content.join(os.EOL) : content,
      metadata: {}
    }
  }

  let metadata: Markdown['metadata']
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
  return {
    content: contentArr.slice(metadataStrArr.length + 2).join(os.EOL),
    metadata,
  }

}


export default parseMarkdown
