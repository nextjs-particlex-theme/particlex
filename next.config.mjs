import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  cleanDistDir: true,
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default withBundleAnalyzer(nextConfig)
