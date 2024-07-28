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