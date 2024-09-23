import React from 'react'
import Link from 'next/link'
import styles from './footer.module.scss'
import { concatClassName } from '@/lib/DomUtils'
import ServiceBeans from '@/api/svc/ServiceBeans'

const Footer:React.FC =  async () => {
  const config = await ServiceBeans.blogService.getConfig()
  return (
    <div id="footer" className={concatClassName('link-styled-container', styles.footerContainer, 'md:w-[56rem]')}>
      <div className="mt-2">
        <span>{config.title}</span>
        <span>&nbsp;</span>
        <Link id="copyright" href={config.homePage}>@{config.author}</Link>
      </div>
      <div className="mt-2">
        Based on <Link href="https://nextjs.org/">Next.js</Link> & <Link href="https://github.com/IceOfSummer/hexo-theme-particlex-nextjs">hexo-theme-particlex-nextjs</Link>
      </div>
    </div>
  )
}

export default Footer