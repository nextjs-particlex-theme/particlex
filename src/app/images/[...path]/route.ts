import ServiceBeans from '@/api/svc/ServiceBeans'

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
  const resource = await ServiceBeans.blogService.getAllStaticResource()
  const r: StaticParams = resource.map(v => ({ path: v.visitPath }))

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
  const res = await ServiceBeans.blogService.getStaticResourceByWebUrl(params.path)

  if (!res) {
    return new Response('If you see this page, it means you don\'t have any files in your source/images folder.' +
      'Because of the limitation of next.js, we have to create a fallback page. \n\n' +
      'But if you have files in source/images and this page still generated, it maybe the bug of the theme.', {
      status: 200
    })
  }
  return new Response(base64ToUint8Array(res.base64), {
    headers: {
      'Content-Type': res.contentType
    }
  })
}