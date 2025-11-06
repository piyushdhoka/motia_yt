/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Configure path aliases
  experimental: {
    esmExternals: false,
  },

  // Configure transpilation for node_modules
  transpilePackages: ['better-auth'],

  // Standalone output for Docker
  output: 'standalone',

  // Configure webpack to handle BetterAuth modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },

  // Environment variables available in the browser
  env: {
    NEXT_PUBLIC_DEV_MODE: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig