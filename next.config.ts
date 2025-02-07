import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  env: {
    NOTLINK_BACKEND_HOST: process.env.NOTLINK_BACKEND_HOST,
    NOTLINK_UI_HOST: process.env.NOTLINK_UI_HOST,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    WHICH_NODE_ENV: process.env.WHICH_NODE_ENV,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
  },

  async rewrites() {
    return [
      {
        // Match any URL that isn’t handled by Next.js (e.g. excluding /api, /_next, etc.)
        source: '/:short_code((?!api|_next|static).*)',
        destination: `${process.env.NOTLINK_BACKEND_HOST}/:short_code`,
      },
    ]
  },
};

export default nextConfig;
