import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'testtestantivity.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);