/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },

  // Refuerzo del noindex de app/layout.tsx. La cabecera cubre también las
  // respuestas que no son HTML (imágenes, JSON) y se respeta aunque el
  // rastreador no llegue a interpretar la página.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};
export default nextConfig;
