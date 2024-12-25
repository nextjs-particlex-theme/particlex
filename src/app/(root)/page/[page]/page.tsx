import React from 'react'
import HomeBase from '@/app/(root)/HomeBase'
import ServiceBeans from '@/api/svc/ServiceBeans'

type Params = {
  page: string
}

export async function generateStaticParams() {
  const service = ServiceBeans.blogService
  const config = service.getConfig()
  const size = Math.ceil(service.homePostSize() / config.indexPageSize)

  const result: Params[] = []
  for (let i = 1; i <= size; i++) {
    result.push({
      page: i.toString(10),
    })
  }
  return result
}


export default async function HomePage(props: {params: Promise<Params>}) {
  return (<HomeBase currentPage={Number.parseInt((await props.params).page) - 1}/>)
}
