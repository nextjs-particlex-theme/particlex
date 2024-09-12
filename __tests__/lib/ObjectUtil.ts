import { arraySpliceKeepOriginal, deepCopy, isPromise, toMapAble } from '@/lib/ObjectUtils'


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

  const copied =deepCopy(o)
  expect(copied).toStrictEqual(o)
  expect(copied === o).toBeFalsy()
})

function testArraySpliceKeepOriginal<T>(arr: T[], start: number, deleteCount?: number): T[] {
  const cpArr = [...arr]

  const spliced = arraySpliceKeepOriginal(arr, start, deleteCount)
  expect(arr).toStrictEqual(cpArr)
  expect(spliced === arr).toBeFalsy()
  return spliced
}

test('arraySpliceKeepOriginal_normalData_deleteSuccess', () => {
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], 1, 1)).toStrictEqual([1, 3, 4, 5])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], 0, 99999)).toStrictEqual([])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], 4, 99999)).toStrictEqual([1, 2, 3, 4])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], -999, 99999)).toStrictEqual([])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], -999, 99999)).toStrictEqual([])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], 999, 99999)).toStrictEqual([1, 2, 3, 4])
  expect(testArraySpliceKeepOriginal([1, 2, 3, 4, 5], -999, 1)).toStrictEqual([2, 3, 4, 5])
  expect(testArraySpliceKeepOriginal([], 999, 99999)).toStrictEqual([])
})

test('isPromise_normalData', () => {
  expect(isPromise({})).toBeFalsy()
  expect(isPromise({ then: () => {} })).toBeFalsy()
  // How to cope with this?
  expect(isPromise({ then: () => {}, catch: () => {} })).toBeTruthy()
  expect(new Promise(() => {})).toBeTruthy()
})

test('toMapAble_normalData', () => {
  const map = new Map<string, number>()

  map.set('1', 1)
  map.set('2', 2)
  map.set('3', 3)
  const r = toMapAble(map).map((value) => value + 1)

  expect(r).toStrictEqual([2, 3, 4])
})