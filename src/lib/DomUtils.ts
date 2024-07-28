/**
 * 连接 className, 每个数组元素仅会处理 string 类型，其它类型将会被忽略
 */
export function concatClassName(...classNames: unknown[]): undefined | string {
  const classes: string[] = []
  for (let className of classNames) {
    if (typeof className === 'string') {
      classes.push(className)
    }
  }
  return classes.length === 0 ? undefined : classes.join(' ')
}