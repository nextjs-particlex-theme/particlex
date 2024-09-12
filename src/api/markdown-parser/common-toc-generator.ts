import type { TocItem } from '@/api/datasource/types/definitions'

type WrappedTocItem = {
  item: TocItem
  actualLevel: number
}

const SPLIT_REGX = /^(#{1,5}) (.*)/gm

export const titleToId = (title: string): string => {
  return title.replaceAll(' ', '-').toLowerCase()
}

/**
 * 生成 toc
 * @param markdown md 文本内容
 */
const generateTocByMarkdown = (markdown: string): TocItem[] => {
  let exec
  const parentStack: WrappedTocItem[] = [{ item: { title: 'FakeRoot', child: [], anchor: '#' }, actualLevel: -1 }]
  while ((exec = SPLIT_REGX.exec(markdown))) {
    const title = exec[2]
    const data = {
      title: title,
      anchor: '#' + titleToId(title)
    }
    const item: WrappedTocItem = {
      item: {
        ...data,
        child: []
      },
      actualLevel: exec[1].length,
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
  }
  return parentStack[0].item.child
}

export default generateTocByMarkdown