import datasource from '@/api/datasource'
import React from 'react'
import HomeBase from '@/app/(root)/HomeBase'

type Params = {
  page: string
}

export async function generateStaticParams() {
  const config = await datasource.getConfig()
  const size = Math.ceil(await datasource.pagePostsSize() / config.indexPageSize)

  const result: Params[] = []
  for (let i = 1; i <= size; i++) {
    result.push({
      page: i.toString(10),
    })
  }
  return result
}


export default async function HomePage(props: {params: Params}) {
  return (
    <HomeBase currentPage={Number.parseInt(props.params.page) - 1}/>
  )
}
