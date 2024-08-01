import HeaderClient from '@/components/Header/HeaderClient'
import React from 'react'
import datasource from '@/api/datasource'

interface HeaderProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
  /**
   * 博客标题
   */
  title: string
}


const Header: React.FC<HeaderProps> = async (props) => {
  let aboutPageUrl: string
  if ((await datasource.getPostByWebUrl(['about']))) {
    aboutPageUrl = '/about'
  } else if (await datasource.getPostByWebUrl(['about', 'index'])) {
    aboutPageUrl = '/about/index'
  } else {
    aboutPageUrl = ''
  }
  return (
    <HeaderClient {...props} aboutPageUrl={aboutPageUrl} showAboutPage={!!aboutPageUrl} />
  )
}

export default Header