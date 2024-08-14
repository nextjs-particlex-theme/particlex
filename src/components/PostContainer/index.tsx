import React from 'react'
import { concatClassName } from '@/lib/DomUtils'

interface PostContainerProps extends React.HTMLProps<HTMLDivElement> {
  
}

/**
 * 统一控制文章容器.
 */
const PostContainer:React.FC<React.PropsWithChildren<PostContainerProps>> = props => {
  return (
    <div {...props} className={concatClassName('w-full md:w-[56rem] pt-40 pb-40 p-3 md:p-12 box-border overflow-hidden relative m-auto', props.className)}>
      {props.children}
    </div>
  )
}

export default PostContainer