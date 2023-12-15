const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    querystring: require.resolve("querystring-es3"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify"),
    path: require.resolve("path-browserify"),
    fs: require.resolve("browserify-fs"),
    util: require.resolve("util/"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
