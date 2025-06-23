/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Adiciona uma regra para lidar com o 'worker' do pdf.js
    config.module.rules.push({
      test: /pdf\.worker\.min\.mjs$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;