import datasource from '@/api/datasource'
import * as fs from 'node:fs'
import mime from 'mime'

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

type StaticParams = { path: string[] }[]

export async function generateStaticParams(): Promise<StaticParams> {
  const resource = await datasource.getAllStaticResource()

  const r: StaticParams = []
  resource.forEach(v => {
    r.push({
      // 删除 image 开头
      path: v.getAccessPath().split('/').splice(1),
    })
  })

  if (r.length > 0) {
    return r
  }
  // Build will fail if return an empty array.
  // https://github.com/vercel/next.js/issues/61213
  return [
    {
      path: ['fallback']
    }
  ]
}

interface ResourceRouteParam {
  params: {
    path: string[]
  }
}

export async function GET(_: unknown, { params }: ResourceRouteParam) {
  const resource = await datasource.getAllStaticResource()
  const res = resource.get(params.path.join('/'))

  if (!res) {
    return new Response('If you see this page, it means you don\'t have any files in your source/images folder.' +
      'Because of the limitation of next.js, we have to create a fallback page. \n\n' +
      'But if you have files in source/images and this page still generated, it maybe the bug of the theme.', {
      status: 200
    })
  }
  return new Response(base64ToUint8Array(fs.readFileSync(res.filepath, { encoding: 'base64' })), {
    headers: {
      'Content-Type': mime.getType(res.filepath) ?? 'plain/text'
    }
  })
}