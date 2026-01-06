/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "book-thumbnail-bucket.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  reactStrictMode: false,
  // Disable server-side source maps in development to avoid malformed "sourceMapURL could not be parsed" errors
  // (these invalid source map comments appear in some compiled vendor chunks and cause runtime warnings).
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Temporarily re-enable server-side dev source maps to capture the overlay error
      // and identify the offending chunk. Revert this after debugging.
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
