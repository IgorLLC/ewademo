/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@ewa/types", "@ewa/ui", "@ewa/utils", "@ewa/api-client"],
  eslint: {
    // Evita que errores de ESLint bloqueen builds de producción
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Excluir módulos de Node.js del bundle del cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
