/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "muzik-files-server.000webhostapp.com",
                port: "",
                pathname: "/paper-money-auction-files/asset-docs/**",
            },
        ],
    }
};

export default nextConfig;
