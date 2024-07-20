import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { PreloadResources } from '@/app/preload-resources'
import { getHexoConfig } from '@/api/hexo-api'
if (!process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
  // @ts-ignore
  import('../common/font/fonts.min.css')
}

export const metadata: Metadata = {
  title: 'Hexo-Blog',

}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getHexoConfig()
  return (
    <html lang="zh">
      <PreloadResources/>
      <body>
        <Header title={config.title} autoTransparentOnTop/>
        {children}
      </body>
    </html>
  )
}
