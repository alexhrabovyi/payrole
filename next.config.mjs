/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.watchOptions = {
      ignored: ['**/*.test.[js|jsx|ts|tsx]', '**/__tests__/**'],
    };

    return config;
  },
};

export default nextConfig;
