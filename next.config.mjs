/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.fdac20-1.fna.fbcdn.net',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

export default nextConfig
