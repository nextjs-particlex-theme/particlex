import './globals.css'
import { PreloadResources } from './preload-resources'
import type { Metadata } from 'next'
import datasource from '@/api/datasource'
import React from 'react'
import SvgSymbols from '@/app/svg-symbols'
import Footer from '@/components/Footer'


export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
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
    <html lang="zh">
      <PreloadResources/>
      <body>
        <SvgSymbols/>
        {children}
        <Footer/>
      </body>
    </html>
  )
}
