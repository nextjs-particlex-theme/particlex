import '../globals.css'
import { PreloadResources } from '@/app/(root)/preload-resources'
import { getHexoConfig } from '@/api/hexo-api'
if (!process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
  // @ts-ignore
  import('../../common/font/fonts.min.css')
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
