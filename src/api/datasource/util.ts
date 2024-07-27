import { TocItem } from '@/api/datasource/types'
import { JSDOM } from 'jsdom'

const LEVEL_MAPPING: Record<string, number> = {
  H1: 0,
  H2: 1,
  H3: 2,
  H4: 3,
  H5: 4,
  H6: 5,
}

/**
 * 根据 html 自动生成 Toc，要求根元素下包含 <h1> <h2> 等标签，而不是被内嵌在其它子元素中。
 *
 * @param html
 */
export function generateShallowToc(html?: string): TocItem[] {
  if (!html) {
    return []
  }
  const dom = new JSDOM(html, { contentType: 'text/html' })

  const root = dom.window.document.body.childNodes.item(0)

  let parentStack: TocItem[] = [{ title: 'FakeRoot', child: [] }]
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
      const item: TocItem = {
        title: heading.innerHTML,
        child: []
      }
      parentStack[currentLevel].child.push(item)
      parentStack[currentLevel + 1] = item
    }
    // FIXME 如何处理? 父节点不存在，例如 h1 里面 套了个 h3.
  })
  return parentStack[0].child
}