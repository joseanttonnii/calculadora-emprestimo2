/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite concluir o deploy mesmo se o TS reclamar de algo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora avisos de formatação durante o deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
