/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Замініть 'xxx.supabase.co' на вашу адресу з .env.local
        hostname: 'https://sosbeqebbzaagnpqdftl.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },};

export default nextConfig;