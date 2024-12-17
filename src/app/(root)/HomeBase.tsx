import Header from '@/components/Header'
import RootImageHeader from '@/app/(root)/RootImageHeader'
import PostPreview from '@/app/(root)/PostPreview'
import React from 'react'
import HomePagination from '@/app/(root)/HomePagination'
import ServiceBeans from '@/api/svc/ServiceBeans'

interface RootLayoutProps {
  /**
   * 逻辑页码，从 0 开始的页码
   */
  currentPage: number
}

const HomeBase: React.FC<RootLayoutProps> = async props => {
  const service = ServiceBeans.blogService
  const { title, background, indexPageSize, description, subtitle } = await service.getConfig()
  const posts = await service.pageHomePosts(props.currentPage, indexPageSize)
  const total = await service.homePostSize()
  const p = Math.ceil(total / indexPageSize)

  return (
    <div>
      <Header autoTransparentOnTop/>
      <div id="container" className="fade-in">
        <RootImageHeader images={background} title={title} description={description} subtitle={subtitle}/>
        <div className="flex flex-col items-center p-3 w-full">
          <div className="w-full">
            {
              posts.map(val => (<PostPreview post={val} key={val.id}/>))
            }
          </div>
          <HomePagination totalPage={p} currentPage={props.currentPage + 1}/>
        </div>
      </div>
    </div>
  )
}

export default HomeBase