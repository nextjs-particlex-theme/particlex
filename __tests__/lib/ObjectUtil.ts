import { expect, test } from '@jest/globals'
import { arraySpliceKeepOriginal, deepCopy } from '@/lib/ObjectUtils'


test('deepCopy_normalData_copySuccess', () => {
  const o = {
    a: 1,
    b: '2',
    c: null,
    d: [1, 2, 3],
    e: ['1', '2', '3'],
    f: [[1, 2], [2, 3], [4, 5]],
    g: [
      {
        a: 1,
        b: [1, 2]
      },
      {
        a: 2,
        b: [3, 4]
      }
    ],
    h: {
      a: {
        a: ['1', 1]
      }
    }
  }
  
  expect(deepCopy(o)).toStrictEqual(o)
})

test('arraySpliceKeepOriginal_normalData_deleteSuccess', () => {
  const arr = [1, 2, 3, 4, 5]
  const cpArr = [...arr]

  const spliced = arraySpliceKeepOriginal(arr, 1, 1)
  expect(spliced).toStrictEqual([1, 3, 4, 5])
  expect(arr).toStrictEqual(cpArr)
  expect(spliced === arr).toBeFalsy()
})

test('arraySpliceKeepOriginal_extremeParameter_deleteSuccess', () => {
  expect(
    arraySpliceKeepOriginal([1, 2, 3, 4, 5], 0, 99999)
  ).toStrictEqual([])

  expect(
    arraySpliceKeepOriginal([1, 2, 3, 4, 5], 4, 99999)
  ).toStrictEqual([1, 2, 3, 4])

  expect(
    arraySpliceKeepOriginal([1, 2, 3, 4, 5], -999, 99999)
  ).toStrictEqual([])

  expect(
    arraySpliceKeepOriginal([1, 2, 3, 4, 5], 999, 99999)
  ).toStrictEqual([1, 2, 3, 4])
})