// https://github.com/shadowwalker/next-pwa#available-options
// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
// });

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
