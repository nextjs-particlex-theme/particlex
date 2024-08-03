import path from "node:path"
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
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.d\.ts$/,
        include: [path.resolve('node_modules/hexo')],
        use: 'ignore-loader',
      },
      {
        test: /\.js\.map$/,
        include: [path.resolve('node_modules/hexo')],
        use: 'ignore-loader',
      }
    );

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
