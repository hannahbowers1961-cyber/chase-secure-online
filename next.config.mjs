/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, 
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', 
    },
  },
};

export default nextConfig;