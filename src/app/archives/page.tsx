import React from 'react'
import datasource from '@/api/datasource'
import Header from '@/components/Header'
import SearchableArchives from '@/app/archives/SearchableArchives'

export default async function ArchivesPage() {
  const homePosts = await datasource.pageHomePosts(0, 999)
  const config = await datasource.getConfig()
  
  return (
    <div>
      <Header title={config.title}/>
      <div id="container" className="fade-in p-12 pt-40 w-[56rem] m-auto">
        <SearchableArchives posts={homePosts.map(v => v.toClientSafePost())}/>
      </div>
    </div>
  )
}
