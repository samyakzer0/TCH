/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['readdy.ai'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
}

module.exports = nextConfig
