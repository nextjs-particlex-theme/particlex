import React from 'react'
import { getHexoConfig } from '@/api/hexo-api'

interface HeaderProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
}

const Header:React.FC<HeaderProps> = async () => {
  const config = await getHexoConfig()
  return (
    <div className={'bg-blue-300 p-3 font-bold}'}>
      { config.title }
    </div>
  )
}

export default Header