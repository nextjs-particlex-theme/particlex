import path from "node:path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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

export default nextConfig;
