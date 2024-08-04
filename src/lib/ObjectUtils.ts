/**
 * 深拷贝
 */
export const deepCopy = <T> (target: T): T => {
  if (!target) {
    return target
  }
  if (Array.isArray(target)) {
    const result = []
    for (let objElement of target) {
      result.push(deepCopy(objElement))
    }
    // @ts-ignore
    return result
  } else if (typeof target === 'object') {
    const result = {}
    // @ts-ignore
    Object.entries(target).forEach(([k, v]) => {
      // @ts-ignore
      result[k] = deepCopy(v)
    })
    // @ts-ignore
    return result
  } else {
    return target
  }
}


/**
 * 类似 {@link Array#splice}，但是不会影响原数组
 * @param arr 原数组
 * @param start 开始索引, 如果小于0，则会被转换成0，如果大于等于数组长度，则会被转换为 `start - 1`
 * @param deleteCount 删除元素数量
 */
export const arraySpliceKeepOriginal = <T> (arr: Readonly<T[]>, start: number, deleteCount?: number): T[] => {
  if (!deleteCount) {
    return [...arr]
  }
  if (start < 0) {
    start = 0
  } else if (start >= arr.length) {
    start = arr.length - 1
  }
  const result: T[] = []
  let i = 0
  for (; i < start; ++i) {
    result.push(arr[i])
  }
  i += deleteCount
  for (; i < arr.length; ++i) {
    result.push(arr[i])
  }
  return result
}

/**
 * 判断是否为 promise
 */
export const isPromise = (val: unknown): val is Promise<unknown> => {
  return (
    val !== null &&
    typeof val === 'object' &&
    typeof (val as Promise<unknown>).then === 'function' &&
    typeof (val as Promise<unknown>).catch === 'function'
  )
}