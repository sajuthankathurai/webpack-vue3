const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, options) => {
  const devMode = options.mode != "production";
  return {
    context: path.resolve(__dirname, "src"),
    entry: {
      "vue-bundle": "./entry/main.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      chunkFilename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: [">25%"],
                    debug: true,
                    corejs: "3.6.5",
                    useBuiltIns: false,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.vue$/,
          use: "vue-loader",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new BundleAnalyzerPlugin({        
        openAnalyzer: false,
        analyzerMode: "static",
        reportFilename: "webpack_bundle_analyser_report.html",
        defaultSizes: "gzip",
      }),
    ],
    optimization: {
      mangleWasmImports: true,
      removeAvailableModules: true,
      sideEffects: true,
      minimize: devMode ? false : true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          exclude: /\/node-modules/,
          parallel: 4,
          extractComments: false,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor-bundle",
            chunks: "all",
          },
        },
      },
    },
    devtool: devMode ? "eval-cheap-source-map" : false,
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"],
      alias: {
        vue: "vue/dist/vue.esm-bundler.js"
      },
    },
  };
};
