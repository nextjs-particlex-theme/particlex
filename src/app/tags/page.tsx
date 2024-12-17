import React from 'react'
import Header from '@/components/Header'
import { Icons } from '@/app/svg-symbols'
import CategoryItem, { type CategoryItemProps, parseMapData } from '@/components/CategoryItem'
import type { Metadata } from 'next'
import CommentComponentInject from '@/components/CommentComponentInject'
import ServiceBeans from '@/api/svc/ServiceBeans'

export async function generateMetadata(): Promise<Metadata> {
  const config = await ServiceBeans.blogService.getConfig()
  return {
    title: 'Tags | 标签 | ' + config.title,
    description: 'Tags for all blog posts. 博客文章的标签.',
    keywords: ['Tags']
  }
}


const TagsPage: React.FC = async () => {
  const entities: CategoryItemProps[] = await parseMapData(await ServiceBeans.blogService.getTagMapping())

  return (
    <>
      <Header />
      <div id="container" className="py-40 px-4 fade-in w-full md:w-[56rem] m-auto">
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
            entities.map(value => (
              <CategoryItem {...value} key={value.name}/>
            ))
          }
        </div>
        <CommentComponentInject/>
      </div>
    </>
  )
}

export default TagsPage
