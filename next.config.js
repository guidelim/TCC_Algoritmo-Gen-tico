/** @type {import('next').NextConfig} */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'credentials.env') });

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        SECRET_KEY: process.env.SHARED_SECRET
    },
    async rewrites() {
        return [
            {
                source: '/info',
                destination: '/about'
            }
        ]
    },
    async headers() {
        return [
            {
                source: '/(.*)', 
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'",
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'no-referrer',
                    },
                    {
                        key: 'Feature-Policy',
                        value: "geolocation 'self'; midi 'self'; sync-xhr 'self'; magnetometer 'none'; gyroscope 'none'; speaker 'self'; fullscreen 'self'; payment 'none'",
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self'",
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                      },
                ],
            },
        ];
    },
}

/*,
    basePath: '/abs',
    assetPrefix: '/abs/'*/
module.exports = nextConfig