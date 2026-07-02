import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "minio-n4ssgsggw8ow0ksgss000sw8.135.181.238.146.sslip.io",
				port: "",
				pathname: "**",
			}
		],
		unoptimized: true,
	},
};

export default nextConfig;
