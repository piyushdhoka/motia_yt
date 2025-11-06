/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
}

module.exports = nextConfig