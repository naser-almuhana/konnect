import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: `lh3.googleusercontent.com`,
        pathname: "/a/*",
      },
    ],
  },
  rewrites: async () => {
    return Promise.resolve([
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ])
  },
}

export default nextConfig
