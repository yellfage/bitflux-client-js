const path = require('path')
const { SourceMapDevToolPlugin } = require('webpack')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')

const { NODE_ENV } = process.env

const SRC_PATH = path.resolve(__dirname, 'src')
const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const TS_CONFIG_PATH = path.resolve(__dirname, 'tsconfig.json')

module.exports = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: {
    index: SRC_PATH,
  },
  output: {
    filename: '[name].js',
    path: OUTPUT_PATH,
    libraryTarget: 'commonjs2',
  },
  externals: ['core-js/web/url', 'abort-controller/polyfill'],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  stats: { modules: false, children: false },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [SRC_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    new ForkTsCheckerPlugin({
      typescript: { configFile: TS_CONFIG_PATH },
    }),
  ],
}
