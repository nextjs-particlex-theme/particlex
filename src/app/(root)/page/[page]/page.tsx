import { Metadata } from 'next'
import datasource from '@/api/datasource'
import Index from '@/components/Header'
import React from 'react'
import RootImageHeader from '@/app/(root)/RootImageHeader'
import PostPreview from '../../PostPreview'

type Params = {
  page: string
}

export async function generateStaticParams() {
  const config = await datasource.getConfig()
  const size = Math.ceil(await datasource.pagePostsSize() / config.indexPageSize)

  const result: Params[] = []
  for (let i = 1; i <= size; i++) {
    result.push({
      page: i.toString(10),
    })
  }
  return result
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()

  return {
    title: config.title,
    description: config.description
  }
}


export default async function Home(props: {params: Params}) {
  const { title,background, description, indexPageSize, subtitle } = await datasource.getConfig()
  console.log(props)
  const posts = await datasource.pagePosts(Number.parseInt(props.params.page) - 1, indexPageSize)

  return (
    <div>
      <Index title={title} autoTransparentOnTop/>
      <div>
        <RootImageHeader images={background} title={title} description={description} subtitle={subtitle}/>
        <div className="flex flex-col items-center">
          <div>
            {
              posts.map(val => (<PostPreview post={val} key={val._id}/>))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
