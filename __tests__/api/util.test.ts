import { expect, test } from '@jest/globals'
import { generateShallowToc } from '@/api/datasource/util'
import type { TocItem } from '@/api/datasource/types'

/**
 * 正确标题内容，生成正确信息
 */
test('generateShallowToc_rightContent_generateSuccess', () => {
  const r = generateShallowToc(`
      <h1>111</h1>
      <div>eee</div>
      <p>222</p>
      <h2>222</h2>
      <h3>333</h3>
      <h1>444</h1>
      <h2>555</h2>
      <h2>666</h2>
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
  const content = generateShallowToc(`
      <h2>222</h2>  
      <h1>111</h1>
      <h3>333</h3>
      <h4>444</h4>
      <h6>555</h6>
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
  const content = generateShallowToc('<div><span>hello</span></div>')
  expect(content).toStrictEqual([])
})

/**
 * 使用内嵌标题，忽略内嵌的标题
 */
test('generateShallowToc_nestedHeading_ignoreNestedHeading', () => {
  const content = generateShallowToc(`
    <h1>111</h1>
    <div>
        <h2>n222</h2>
    </div>
    <h3>333</h3>
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

test('generateShallowToc_useCustomCaster_parseSuccess', () => {
  const content = generateShallowToc(`
    <h1 id="link"><a href="#link" class="headerlink" title="hello"></a>hello</h1>
  `, nodes => {
    const t = nodes.item(1) as any
    const l = nodes.item(0) as HTMLAreaElement
    expect(t).toBeTruthy()
    return {
      title: t.data,
      anchor: l.getAttribute('href')!
    }
  })
  const expected: TocItem[] = [
    {
      title: 'hello',
      anchor: '#link',
      child: []
    }
  ]

  expect(content).toStrictEqual(expected)
})