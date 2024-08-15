import React from 'react'
import { concatClassName } from '@/lib/DomUtils'

interface PostContainerProps extends React.HTMLProps<HTMLDivElement> {
  
}

/**
 * 统一控制文章容器.
 */
const PostContainer:React.FC<React.PropsWithChildren<PostContainerProps>> = props => {
  return (
    <div {...props} className={concatClassName('w-full md:w-[56rem] py-20 px-3 md:px-12 box-border overflow-hidden relative m-auto', props.className)}>
      {props.children}
    </div>
  )
}

export default PostContainer