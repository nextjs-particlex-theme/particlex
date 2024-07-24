import datasource from '@/api/datasource'
import * as fs from 'node:fs'
import mime from 'mime'
import { StaticResource } from '@/api/datasource/types'

function base64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


export async function generateStaticParams() {
  const resource = await datasource.getAllStaticResource()

  return Object.values(resource).map(v => ({
    path: v.getAccessPath().split('/'),
  }))
}

interface ResourceRouteParam {
  params: {
    path: string[]
  }
}

export async function GET(_: unknown, { params }: ResourceRouteParam) {
  const resource = await datasource.getAllResource()
  const res = resource[params.path.join('/')] as StaticResource

  if (!res.filepath) {
    return new Response()
  }
  return new Response(base64ToUint8Array(fs.readFileSync(res.filepath, { encoding: 'base64' })), {
    headers: {
      'Content-Type': mime.getType(res.filepath) ?? 'plain/text'
    }
  })
}