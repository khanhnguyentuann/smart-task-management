/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Tắt Next.js development overlay với cấu hình đúng
  devIndicators: {
    position: 'bottom-right',
  },
  // Tắt các overlay khác
  experimental: {
    // Tắt các development features
    optimizePackageImports: [],
  },
}

export default nextConfig