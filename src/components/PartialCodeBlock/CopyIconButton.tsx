import React, { useEffect, useRef } from 'react'
import style from '@/components/PartialCodeBlock/post-content.module.scss'
import { Icons } from '@/app/svg-symbols'
import { arraySpliceKeepOriginal } from '@/lib/ObjectUtils'

interface CopyIconButtonProps {
  onCopy: () => void
}


const CopyIconToast: React.FC<{ onRequireRelease: () => void }> = ({ onRequireRelease }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRequireRelease()
    }, 3000)
    return () => {
      clearTimeout(timeout)
    }
    // `onRequireRelease` will always be updated when new toast create
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={style.copySuccessIcon}>复制成功</div>
  )
}

const CopyIconButton: React.FC<CopyIconButtonProps> = props => {
  const [toasts, setToasts] = React.useState<number[]>([])
  const [copyIconClass, setCopyIconClass] = React.useState(style.icon)
  const toastKey = useRef(0)

  const onCopyDown = () => {
    setCopyIconClass(style.iconClick)
  }

  const onRequireRelease = (key: number) => {
    setToasts((cur) => {
      const i = cur.findIndex(v => v === key)
      if (i < 0) {
        return cur
      }
      return arraySpliceKeepOriginal(cur, i, 1)
    })
  }

  const onCopyUp = () => {
    setToasts((cur) => {
      return [...cur, toastKey.current++]
    })
    setCopyIconClass(style.icon)
    props.onCopy()
  }

  return (
    <div className={style.copyContainer} title="复制">
      <svg width={15} height={15} onMouseDown={onCopyDown} onMouseUp={onCopyUp} className={copyIconClass}>
        <use
          xlinkHref={Icons.COPY}/>
      </svg>
      {
        toasts.map(k => (
          <CopyIconToast key={k} onRequireRelease={() => onRequireRelease(k)}/>
        ))
      }
    </div>
  )
}

export default CopyIconButton
