/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/es/elreto",
        destination: "/es/codigo-origen",
        permanent: true
      },
      {
        source: "/es/reto-dinero",
        destination: "/es/codigo-origen",
        permanent: true
      },
      {
        source: "/en/money-challenge",
        destination: "/en/the-challenge",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
