/** @type {import('next').NextConfig} */
const nextConfig = {
    // 移除 experimental.serverActions，因为它现在默认可用
    webpack: (config) => {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      return config;
    },
  }
  
  export default nextConfig;