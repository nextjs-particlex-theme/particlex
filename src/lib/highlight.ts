import type { HLJSApi } from 'highlight.js'

let instance: HLJSApi | undefined

type PendingQueueElement = {
  resolve: (value: (HLJSApi | PromiseLike<HLJSApi>)) => void
  reject: (reason: string) => void
}

const PENDING_QUEUE: PendingQueueElement[] = []

async function registerAll() {
  // import all.
  // @ts-ignore
  return (await (import('highlight.js'))).default
}

function releaseQueue(i: HLJSApi) {
  instance = i
  i.configure({
    ignoreUnescapedHTML: true
  })
  const pending = PENDING_QUEUE.splice(0, PENDING_QUEUE.length)
  for (let pendingQueueElement of pending) {
    pendingQueueElement.resolve(i)
  }
}

if (!process.env.HIGHLIGHT_JS_RESOLVE_TYPE || process.env.HIGHLIGHT_JS_RESOLVE_TYPE === 'bundled') {
  registerAll().then(i => {
    releaseQueue(i)
  }).catch(e => {
    throw e
  })
} else if (process.env.HIGHLIGHT_JS_RESOLVE_TYPE === 'external') {
  if (!process.env.HIGHLIGHT_JS_RESOLVE_DATA) {
    throw new Error('HIGHLIGHT_JS_RESOLVE_DATA is required.')
  }
  // @ts-ignore
  if (!window.hljs) {
    throw new Error('Could not find hljs instance on `window`!')
  }
  // @ts-ignore
  releaseQueue(window.hljs)
} else {
  throw new Error('Unknown HIGHLIGHT_JS_RESOLVE_TYPE: ' + process.env.HIGHLIGHT_JS_RESOLVE_TYPE)
}

const getHljsInstance = async (): Promise<HLJSApi> => {
  return new Promise((resolve, reject) => {
    if (instance) {
      resolve(instance)
      return
    }
    PENDING_QUEUE.push({ resolve, reject })
  })
}


export default getHljsInstance
