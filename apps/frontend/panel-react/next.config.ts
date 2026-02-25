import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    HOST: process.env.PANEL_REACT_URL || "localhost",
    API_HOST_INTERNAL: `http://${process.env.API_HOST || "api"}:${
      process.env.API_PORT || "3000"
    }`,
    API_HOST_EXTERNAL: process.env.API_URL?.startsWith("/")
      ? process.env.API_URL
      : `https://${process.env.API_URL}`,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  },
  allowedDevOrigins: [
    process.env.PANEL_REACT_URL?.startsWith("/")
      ? `${process.env.NGINX_HOST}:${process.env.NGINX_PORT}`
      : process.env.PANEL_REACT_URL || "localhost",
  ],
  basePath:
    process.env.PANEL_REACT_URL === "/" ||
    !process.env.PANEL_REACT_URL?.startsWith("/")
      ? undefined
      : process.env.PANEL_REACT_URL,
};

export default nextConfig;
