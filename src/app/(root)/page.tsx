import { Metadata } from 'next'
import datasource from '@/api/datasource'
import Index from '@/components/Header'
import React from 'react'
import RootImageHeader from '@/app/(root)/RootImageHeader'
import PostPreview from './PostPreview'



export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()

  return {
    title: config.title,
    description: config.description
  }
}


export default async function Home() {
  const { title, theme_config, description, subtitle } = await datasource.getConfig()
  const posts = await datasource.pagePosts(0, 3)

  return (
    <div>
      <Index title={title} autoTransparentOnTop/>
      <div>
        <RootImageHeader images={theme_config.background} title={title} description={description} subtitle={subtitle}/>
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