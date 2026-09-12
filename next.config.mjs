const nextConfig = {
  serverExternalPackages: ["mssql", "msnodesqlv8", "tedious"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
