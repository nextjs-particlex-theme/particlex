import HeaderClient from '@/components/Header/HeaderClient'
import React from 'react'
import datasource from '@/api/datasource'

interface HeaderProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
}


const Header: React.FC<HeaderProps> = async (props) => {
  const meta = await datasource.getConfig()
  let aboutPageUrl: string
  if ((await datasource.getPostByWebUrl(['about']))) {
    aboutPageUrl = '/about'
  } else if (await datasource.getPostByWebUrl(['about', 'index'])) {
    aboutPageUrl = '/about/index'
  } else {
    aboutPageUrl = ''
  }
  return (
    <HeaderClient title={meta.title} autoTransparentOnTop={props.autoTransparentOnTop} aboutPageUrl={aboutPageUrl} showAboutPage={!!aboutPageUrl} />
  )
}

export default Header