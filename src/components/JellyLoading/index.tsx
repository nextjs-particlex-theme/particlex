/**
 * https://codepen.io/_fbrz/pen/dyebWj
 */
import React from 'react'
import styles from './jelly-loading.module.scss'

const JellyLoading: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.shadow}></div>
      <div className={styles.box}></div>
    </div>
  )
}

export default JellyLoading