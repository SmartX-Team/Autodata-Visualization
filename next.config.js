/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'backend.autodata.smartx.kr',
      'visualization.autodata.smartx.kr',
    ],
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
