import './globals.css'
import { PreloadResources } from './preload-resources'
import type { Metadata } from 'next'
import datasource from '@/api/datasource'
import React from 'react'
import SvgSymbols from '@/app/svg-symbols'
if (!process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
  // @ts-ignore
  import('../common/font/fonts.min.css')
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()

  return {
    title: config.title,
    description: config.description,
    icons: '/images/favicon.ico',
  }
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
      </body>
    </html>
  )
}
