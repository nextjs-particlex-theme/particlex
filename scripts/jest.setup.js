import { TextEncoder, TextDecoder } from 'util'
import path from 'node:path'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const root = path.resolve('__tests__/__blog__')

process.env.BLOG_PATH = root
process.env.BLOG_HOME_POST_DIRECTORY = '_post'
process.env.BLOG_RESOURCE_DIRECTORY = 'images'
process.env.BLOG_POST_DIRECTORY = ''