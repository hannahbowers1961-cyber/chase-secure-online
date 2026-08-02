/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? undefined : 'export',
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