/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle React Native web modules
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Handle platform-specific extensions
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    // Add the shared package to the module resolution paths
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      '../../packages/shared/dist',
    ];

    return config;
  },
  transpilePackages: ['@livescore/shared', 'react-native-web'],
};

module.exports = nextConfig; 