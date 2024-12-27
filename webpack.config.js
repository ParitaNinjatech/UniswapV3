const webpack = require('webpack');

module.exports = {
  // Other webpack configurations...
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      path: require.resolve("path-browserify"),
      fs: false, // Node.js 'fs' is not available in the browser
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
