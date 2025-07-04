/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'juiceimages.s3.eu-north-1.amazonaws.com',
            },
        ],
        unoptimized: true,
        domains: ['juiceimages.s3.eu-north-1.amazonaws.com'],
    },
    logging: {
        fetches: {
            fullUrl: true
        }
    }
};
