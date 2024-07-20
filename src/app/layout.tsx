import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { PreloadResources } from '@/app/preload-resources'
if (!process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
  // @ts-ignore
  import('../common/font/fonts.min.css')
}

export const metadata: Metadata = {
  title: 'Hexo-Blog',

}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <PreloadResources/>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  )
}
