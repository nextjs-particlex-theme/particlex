import { visit } from 'unist-util-visit'


const HEADING_MAP: Record<any, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
}

export default function generateHeadingId() {
  return function (tree: any) {
    visit(tree, 'element', (node) => {
      const level = HEADING_MAP[node.tagName]
      if (!level) {
        return
      }
      const idBuilder: string[] = []
      for (let child of node.children) {
        if (child.type === 'text') {
          idBuilder.push(child.value)
        }
      }
      Object.assign(node.properties, { id: encodeURI(idBuilder.join('-')) })
    })
  }
}