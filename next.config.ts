/** @type {import('next').NextConfig} */
import createNextRemoveImports from 'next-remove-imports';

const removeImports = createNextRemoveImports();
export default removeImports({});

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
