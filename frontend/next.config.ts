import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Qualités autorisées (Next 16 : 75 par défaut). 85 est utilisé pour les logos.
    qualities: [75, 85],
    minimumCacheTTL: 60,
  },
  
  // Compression
  compress: true,
  
  // Performance
  reactStrictMode: true,
  
  // Désactiver le source map en production
  productionBrowserSourceMaps: false,
  
  // Préchargement des scripts et optimisations
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
    // Précharger les liens pour une navigation plus rapide
    scrollRestoration: true,
  },
  
  // Optimisation du serveur
  poweredByHeader: false,
  
  // Headers pour améliorer le cache et la performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
