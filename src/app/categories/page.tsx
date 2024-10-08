import type React from 'react'
import Header from '@/components/Header'
import type { Metadata } from 'next'
import { Icons } from '@/app/svg-symbols'
import { toMapAble } from '@/lib/ObjectUtils'
import CategoryItem from '@/components/CategoryItem'
import CommentComponentInject from '@/components/CommentComponentInject'
import ServiceBeans from '@/api/svc/ServiceBeans'



export async function generateMetadata(): Promise<Metadata> {
  const config = await ServiceBeans.blogService.getConfig()
  return {
    title: 'Categories | 分类 | ' + config.title,
    description: 'Categories for all blog posts. 博客文章的分类.',
    keywords: ['Categories']
  }
}


const Categories: React.FC = async () => {
  const categories = await ServiceBeans.blogService.getCategoriesMapping()

  return (
    <>
      <Header />
      <div id="container" className="pt-40 px-4 fade-in w-full md:w-[56rem] m-auto">
        <div className="flex items-center">
          <svg width="2rem" height="2rem">
            <use xlinkHref={Icons.BOOKMARK}/>
          </svg>
          <h1 className="text-3xl font-bold ml-2">
            Categories | 分类
          </h1>
        </div>
        <div>
          {
            toMapAble(categories).map((value, key) => (
              <CategoryItem name={key} key={key} resources={[...value].sort((a, b) => {
                const val1 = a.date ?? Number.MIN_VALUE
                const val2 = b.date ?? Number.MIN_VALUE
                return val2 - val1
              })}/>
            ))
          }
        </div>
        <CommentComponentInject/>
      </div>
    </>
  )
}


export default Categories