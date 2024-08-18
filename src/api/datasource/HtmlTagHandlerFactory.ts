import type HtmlTagHandler from '@/api/datasource/types/HtmlTagHandler'
import imageHandler from '@/api/datasource/handlers/ImageHandler'
import preHandler from '@/api/datasource/handlers/PreHandler'


const instanceHolder = new Map<string, HtmlTagHandler>()

/**
 * 注册一个 caster
 * @param caster caster
 */
const registerHandler = (caster: HtmlTagHandler) => {
  const tags = Array.isArray(caster.supportedTag) ? caster.supportedTag : [caster.supportedTag]
  for (let tag of tags) {
    const old = instanceHolder.get(tag)
    if (old) {
      throw new Error(`Duplicate MarkdownTagCaster, tag name: ${tag}`)
    }
    instanceHolder.set(tag, caster)
  }
}

registerHandler(imageHandler)
registerHandler(preHandler)

/**
 * 包括一下，方便外面使用的时候好看.
 */
const wrapped = {
  getInstance: (tag: string): HtmlTagHandler | undefined => {
    return instanceHolder.get(tag)
  }
}

export default wrapped