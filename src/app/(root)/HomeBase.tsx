import datasource from '@/api/datasource'
import Header from '@/components/Header'
import RootImageHeader from '@/app/(root)/RootImageHeader'
import PostPreview from '@/app/(root)/PostPreview'
import React from 'react'
import HomePagination from '@/app/(root)/HomePagination'

interface RootLayoutProps {
  /**
   * 逻辑页码，从 0 开始的页码
   */
  currentPage: number
}

const HomeBase: React.FC<RootLayoutProps> = async props => {
  const { title,background, indexPageSize,description, subtitle } = await datasource.getConfig()
  const posts = await datasource.pageHomePosts(props.currentPage, indexPageSize)
  const total = await datasource.pagePostsSize()
  const p = Math.ceil(total / indexPageSize)

  return (
    <div>
      <Header title={title} autoTransparentOnTop/>
      <div id="fade-in">
        <RootImageHeader images={background} title={title} description={description} subtitle={subtitle}/>
        <div className="flex flex-col items-center">
          <div>
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