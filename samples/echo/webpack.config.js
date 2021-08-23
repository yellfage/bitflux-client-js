/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { SourceMapDevToolPlugin } = require('webpack')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const SRC_PATH = path.resolve(__dirname, 'src')
const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const TS_CONFIG_PATH = path.resolve(__dirname, '../../tsconfig.json')

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    index: SRC_PATH
  },
  output: {
    filename: '[name].js',
    path: OUTPUT_PATH
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    port: 5003,
    historyApiFallback: true
  },
  stats: { modules: false, children: false },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new ForkTsCheckerPlugin({
      typescript: { configFile: TS_CONFIG_PATH }
    }),
    new HtmlPlugin({
      hash: false,
      template: `${SRC_PATH}/index.html`,
      filename: 'index.html'
    })
  ]
}
