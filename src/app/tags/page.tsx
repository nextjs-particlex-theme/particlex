import React from 'react'
import Header from '@/components/Header'
import { Icons } from '@/app/svg-symbols'
import { toMapAble } from '@/lib/ObjectUtils'
import CategoryItem from '@/components/CategoryItem'
import datasource from '@/api/datasource'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()
  return {
    title: 'Tags | 标签 | ' + config.title,
    description: 'Tags for all blog posts. 博客文章的标签.',
    keywords: ['Tags']
  }
}


const TagsPage: React.FC = async () => {
  const tags = await datasource.getTagMapping()
  return (
    <>
      <Header />
      <div id="container" className="pt-40 fade-in w-[56rem] m-auto">
        <div className="flex items-center">
          <svg width="2rem" height="2rem">
            <use xlinkHref={Icons.TAG}/>
          </svg>
          <h1 className="text-3xl font-bold ml-2">
            Tags | 标签
          </h1>
        </div>
        <div>
          {
            toMapAble(tags).map((value, key) => (
              <CategoryItem name={key} key={key} resources={[...value].sort((a, b) => {
                const val1 = a.date ?? Number.MIN_VALUE
                const val2 = b.date ?? Number.MIN_VALUE
                return val2 - val1
              })}/>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default TagsPage
