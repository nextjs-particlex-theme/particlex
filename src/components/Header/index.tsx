import React from 'react'
import HeaderClientAdapter from '@/components/Header/HeaderClientAdapter'
import ServiceBeans from '@/api/svc/ServiceBeans'

interface HeaderProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
}


const Header: React.FC<HeaderProps> = async (props) => {
  const service = ServiceBeans.blogService
  const meta = service.getConfig()
  let aboutPageUrl: string
  if ((await service.getPageByWebUrl(['about']))) {
    aboutPageUrl = '/about'
  } else if (await service.getPageByWebUrl(['about', 'index'])) {
    aboutPageUrl = '/about/index'
  } else {
    aboutPageUrl = ''
  }
  return (
    <HeaderClientAdapter title={meta.title} 
      autoTransparentOnTop={props.autoTransparentOnTop} 
      aboutPageUrl={aboutPageUrl} 
      showAboutPage={!!aboutPageUrl} />
  )
}

export default Header