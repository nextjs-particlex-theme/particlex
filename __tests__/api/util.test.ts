import { expect, test } from '@jest/globals'
import type { TocItem } from '@/api/datasource/types/definitions'
import { __test_generateShallowToc } from '@/api/datasource/markdown-parser'


/**
 * 正确标题内容，生成正确信息
 */
test('generateShallowToc_rightContent_generateSuccess', () => {
  const r = __test_generateShallowToc?.(`
      <h1 id="111">111</h1>
      <div>eee</div>
      <p>222</p>
      <h2 id="222">222</h2>
      <h3 id="333">333</h3>
      <h1 id="444">444</h1>
      <h2 id="555">555</h2>
      <h2 id="666">666</h2>
      <span>7777</span>
  `)
  const expected: TocItem[] = [
    {
      title: '111',
      anchor: '#111',
      child: [
        {
          title: '222',
          anchor: '#222',
          child: [
            {
              title: '333',
              anchor: '#333',
              child: []
            }
          ]
        }
      ]
    },
    {
      title: '444',
      anchor: '#444',
      child: [
        {
          title: '555',
          anchor: '#555',
          child: []
        },
        {
          title: '666',
          anchor: '#666',
          child: []
        }
      ]
    }
  ]
  expect(r).toStrictEqual(expected)
})

/**
 * 混乱的标题，忽略错误的标题
 */
test('generateShallowToc_disOrderedContent_ignoreBadHeading', () => {
  const content = __test_generateShallowToc?.(`
      <h2 id="222">222</h2>  
      <h1 id="111">111</h1>
      <h3 id="333">333</h3>
      <h4 id="444">444</h4>
      <h6 id="555">555</h6>
    `)
  const expected: TocItem[] = [
    {
      title: '111',
      anchor: '#111',
      child: []
    }
  ]
  expect(content).toStrictEqual(expected)
})

/**
 * 没有任何标题，返回空数组
 */
test('generateShallowToc_noHeading_returnEmptyArray', () => {
  const content = __test_generateShallowToc?.('<div><span>hello</span></div>')
  expect(content).toStrictEqual([])
})

/**
 * 使用内嵌标题，忽略内嵌的标题
 */
test('generateShallowToc_nestedHeading_ignoreNestedHeading', () => {
  const content = __test_generateShallowToc?.(`
    <h1 id="111">111</h1>
    <div>
        <h2 id="n222">n222</h2>
    </div>
    <h3 id="333">333</h3>
  `)
  const expected: TocItem[] = [
    {
      title: '111',
      anchor: '#111',
      child: []
    }
  ]
  expect(content).toStrictEqual(expected)
})


/**
 * 测试使用 h2 开头的标题
 */
test('generateShallowToc_startWithH2_generateSuccess', () => {
  const content = __test_generateShallowToc?.(`
    <h2 id="111">111</h2>
    <div>
        <h3 id="222">222</h3>
    </div>
    <h3 id="333">333</h3>
    <h2 id="444">444</h2>
  `, 2)
  const expected: TocItem[] = [
    {
      title: '111',
      anchor: '#111',
      child: [
        {
          title: '333',
          anchor: '#333',
          child: []
        }
      ],
    },
    {
      title: '444',
      anchor: '#444',
      child: []
    }
  ]
  expect(content).toStrictEqual(expected)
})
