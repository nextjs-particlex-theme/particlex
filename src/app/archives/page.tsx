import React from 'react'
import Header from '@/components/Header'
import SearchableArchives from '@/app/archives/SearchableArchives'
import type { Metadata } from 'next'
import CommentComponentInject from '@/components/CommentComponentInject'
import ServiceBeans from '@/api/svc/ServiceBeans'


export async function generateMetadata(): Promise<Metadata> {
  const config = ServiceBeans.blogService.getConfig()
  return {
    title: `文章列表 | ${config.title}`,
    description: 'Archives for all blog posts',
  }
}

export default async function ArchivesPage() {
  const homePosts = await ServiceBeans.blogService.pageHomePosts(0, 999)

  return (
    <div>
      <Header />
      <div id="container" className="fade-in p-12 pt-40 w-full md:w-[56rem] m-auto">
        <SearchableArchives posts={homePosts.map(v => v.toClientSafePost())}/>
        <CommentComponentInject/>
      </div>
    </div>
  )
}
