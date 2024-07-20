import Image from 'next/image'
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
    <main>
      Hello world
    </main>
  )
}
