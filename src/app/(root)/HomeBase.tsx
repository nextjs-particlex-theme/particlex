import datasource from '@/api/datasource'
import Header from '@/components/Header'
import RootImageHeader from '@/app/(root)/RootImageHeader'
import PostPreview from '@/app/(root)/PostPreview'
import React from 'react'

interface RootLayoutProps {
  /**
   * 逻辑页码，从 1 开始的页码
   */
  currentPage: number
}

const HomeBase: React.FC<RootLayoutProps> = async props => {
  const { title,background, indexPageSize,description, subtitle } = await datasource.getConfig()
  const posts = await datasource.pageHomePosts(props.currentPage, indexPageSize)

  return (
    <div>
      <Header title={title} autoTransparentOnTop/>
      <div>
        <RootImageHeader images={background} title={title} description={description} subtitle={subtitle}/>
        <div className="flex flex-col items-center">
          <div>
            {
              posts.map(val => (<PostPreview post={val} key={val.id}/>))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBase