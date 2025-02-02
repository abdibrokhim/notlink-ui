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
  },
};

export default nextConfig;
