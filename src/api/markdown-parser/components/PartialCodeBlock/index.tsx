import type React from 'react'
import hljs from 'highlight.js'
import PartialCodeBlockClient from '@/api/markdown-parser/components/PartialCodeBlock/PartialCodeBlockClient'
import {strTrimStart} from "@/lib/ObjectUtils";

interface PartialCodeBlockProps {
  /**
   * 代码块类名
   */
  codeBlockClassname?: string;
  /**
   * 还未高亮的富文本
   */
  html: string
}

const LANGUAGE_MAPPING_FALLBACK: Record<string, string | undefined> = {
  vue: 'html',
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash'
}


const PartialCodeBlock: React.FC<PartialCodeBlockProps> = props => {
  let lang: string[]
  if (props.codeBlockClassname) {
    const langList = props.codeBlockClassname.split(' ')
    if (langList.length === 0) {
      lang = ['plaintext']
    } else {
      let cur = strTrimStart(langList[0], 'language-')
      const fb = LANGUAGE_MAPPING_FALLBACK[cur]
      if (fb) {
        lang = [fb, 'plaintext']
      } else {
        lang = [cur, 'plaintext']
      }
    }
  } else {
    lang = ['plaintext']
  }
  const lighted = hljs.highlightAuto(props.html, lang).value
  return <PartialCodeBlockClient html={lighted} lang={lang[0]}/>
}

export default PartialCodeBlock
