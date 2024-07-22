import './globals.css'
import { PreloadResources } from '@/app/(root)/preload-resources'
import { Metadata } from 'next'
import datasource from '@/api/datasource'
if (!process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
  // @ts-ignore
  import('../common/font/fonts.min.css')
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await datasource.getConfig()

  return {
    title: config.title,
    description: config.description
  }
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
        {children}
      </body>
    </html>
  )
}
