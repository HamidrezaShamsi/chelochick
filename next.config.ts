/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    // Skip type checking during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Skip linting during development
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error', // Hide WebSocket warnings
    }
    return config
  }
}

export default config