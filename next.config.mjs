/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.output.library = "next-table";
    config.output.libraryTarget = "umd"; // Universal Module Definition (for compatibility with CommonJS, ESM, etc.)
    return config;
  },
};

export default nextConfig;
