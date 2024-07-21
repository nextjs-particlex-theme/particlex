import { Metadata } from 'next'
import { getHexoConfig } from '@/api/hexo-api'
import Index from '@/components/Header'
import React from 'react'
import RootImageHeader from '@/app/(root)/RootImageHeader'



export async function generateMetadata(): Promise<Metadata> {
  const config = await getHexoConfig()

  return {
    title: config.title,
    description: config.description
  }
}


export default async function Home() {
  const { title, theme_config, description, subtitle } = await getHexoConfig()

  return (
    <div>
      <Index title={title} autoTransparentOnTop/>
      <div>
        <RootImageHeader images={theme_config.background} title={title} description={description} subtitle={subtitle}/>
        <div style={{ marginTop: 2000 }}>eee</div>
      </div>
    </div>
  )
}
