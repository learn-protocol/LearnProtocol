import path from "path";

const __dirname = path.resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        useCache: true,
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "components")],
        prependData: `@use "@/assets/mixins" as *;`,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "fra1.digitaloceanspaces.com",
                port: "",
                pathname: "/**",
            },
        ],
    }
};

export default nextConfig;
