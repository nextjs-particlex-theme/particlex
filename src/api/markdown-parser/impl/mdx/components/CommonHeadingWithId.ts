import React from 'react'

interface CommonHeadingWithIdProps {
  tag: string
}

function titleToId(title: string): string {
  return title.replaceAll(' ', '-')
}

const CommonHeadingWithId:React.FC<React.PropsWithChildren<CommonHeadingWithIdProps>> = props => {
  let id: string | undefined
  if (typeof props.children === 'string') {
    id = titleToId(props.children)
  }
  return React.createElement(props.tag, { id }, props.children)
}

const createCommonHeadingWithId = (tag: string) => {
  const InlineHeadingComponent = (p: React.PropsWithChildren) => React.createElement(CommonHeadingWithId, { tag }, p.children)
  if (process.env.NODE_ENV) {
    // suppress inline warnings.
  }
  return InlineHeadingComponent
}

export default createCommonHeadingWithId
