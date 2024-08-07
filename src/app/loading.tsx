import React from 'react'
import Image from 'next/image'
import styles from './loading.module.scss'
import { concatClassName } from '@/lib/DomUtils'

const RootLoading:React.FC = () => {
  return (
    <div className="bg-background w-screen h-screen flex justify-center items-center fixed top-0 z-10">
      <div
        className={styles.loadingContainer}>
        <div className={concatClassName('text-3xl mb-2', styles.loadingTitle)}>
          LOADING
        </div>
        <div className={styles.loadingText}>
          加载中
        </div>
        <Image src="/images/loading.gif" alt="Loading..." width={64} height={51}/>
        <div className={styles.loadingOutCircle}/>
      </div>
    </div>
  )
}

export default RootLoading