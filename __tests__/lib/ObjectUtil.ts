import { expect, test } from '@jest/globals'
import { deepCopy } from '@/lib/ObjectUtils'


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

