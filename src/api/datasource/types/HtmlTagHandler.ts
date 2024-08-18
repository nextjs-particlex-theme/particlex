import type { Element, HTMLReactParserOptions } from 'html-react-parser'

type HtmlTagHandler = {

  /**
   * 支持的 Html TAG.
   */
  supportedTag: Lowercase<string> | Lowercase<string>[]

  /**
   * 进行转换
   * @param node
   */
  doCast(node: Element): ReturnType<Required<HTMLReactParserOptions>['replace']>
  
  
}


export default HtmlTagHandler