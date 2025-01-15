/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
        ignoreBuildErrors: true,
    },
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'logo.clearbit.com',
                port: '',
                pathname: '/**'
            },
        ]
    },
};

module.exports = nextConfig;
