const nextConfig = {
  serverExternalPackages: [
    "mongoose",
    "bcryptjs",
    "nodemailer",
    "jsonwebtoken",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chessboardjs.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  redirects: async () => [
    {
      source: "/white",
      destination: "/game/white",
      permanent: true,
    },
    {
      source: "/black",
      destination: "/game/black",
      permanent: true,
    },
    {
      source: "/ai",
      destination: "/game/ai",
      permanent: true,
    },
  ],
};

export default nextConfig;
