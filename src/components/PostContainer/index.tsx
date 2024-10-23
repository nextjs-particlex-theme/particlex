import React from 'react'
import { concatClassName } from '@/lib/DomUtils'

/**
 * 统一控制文章容器.
 */
const PostContainer:React.FC<React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>> = props => {
  return (
    <div {...props} className={concatClassName('w-full md:w-[56rem] py-20 px-3 md:px-12 box-border overflow-hidden relative m-auto', props.className)}>
      {props.children}
    </div>
  )
}

export default PostContainer