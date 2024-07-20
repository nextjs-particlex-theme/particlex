import { Metadata } from 'next'
import { getHexoConfig } from '@/api/hexo-api'



export async function generateMetadata(): Promise<Metadata> {
  const config = await getHexoConfig()

  return {
    title: config.title,
    description: config.description
  }
}

export default function Home() {
  return (
    <div>
      <p style={{ height: '100vh' }} className="bg-sky-200">Hello world</p>
      <p style={{ height: '200vh' }}>Hello world</p>
    </div>
  )
}
