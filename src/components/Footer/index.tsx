import React from 'react'
import datasource from '@/api/datasource'
import Link from 'next/link'
import styles from './footer.module.scss'
import { concatClassName } from '@/lib/DomUtils'

const Footer:React.FC =  async () => {
  const config = await datasource.getConfig()
  return (
    <div className={concatClassName('link-styled-container', styles.footerContainer, 'w-[56rem]')}>
      <div className="mt-2">
        <span>{config.title}</span>
        <span>&nbsp;</span>
        <Link href={config.homePage}>@{config.author}</Link>
      </div>
      <div className="mt-2">
        Based on <Link href="https://nextjs.org/">Next.js</Link> & <Link href="https://github.com/IceOfSummer/hexo-theme-particlex-nextjs">hexo-theme-particlex-nextjs</Link>
      </div>
    </div>
  )
}

export default Footer