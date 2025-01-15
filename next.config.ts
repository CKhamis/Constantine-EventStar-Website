/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
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
