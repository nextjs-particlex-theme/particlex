import './globals.css'
import { PreloadResources } from './preload-resources'
import type { Metadata } from 'next'
import React from 'react'
import SvgSymbols from '@/app/svg-symbols'
import Footer from '@/components/Footer'
import ServiceBeans from '@/api/svc/ServiceBeans'


export async function generateMetadata(): Promise<Metadata> {
  const config = await ServiceBeans.blogService.getConfig()

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
  }

  if (config.metadata) {
    metadata.other = {
      ...config.metadata
    }
  }

  if (config.favicon) {
    metadata.icons = config.favicon
  }

  return metadata
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  post: React.ReactNode
  resource: React.ReactNode
}>) {
  return (
    <html lang="zh" className="text-[14px] md:text-[16px]">
      <head>
        <link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL ?? ''}/fonts/fonts.min.css`}></link>
        <link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL ?? ''}/css/github.min.css`}></link>
      </head>
      <PreloadResources/>
      <body>
        <SvgSymbols/>
        {children}
        <Footer/>
      </body>
    </html>
  )
}
