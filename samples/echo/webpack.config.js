/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { SourceMapDevToolPlugin } = require('webpack')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const { NODE_ENV } = process.env

const PATH_SRC = path.resolve(__dirname, 'src')
const PATH_OUTPUT = path.resolve(__dirname, 'dist')
const PATH_TS_CONFIG = path.resolve(__dirname, '../../tsconfig.json')

module.exports = {
  mode: NODE_ENV,
  devtool: 'eval-source-map',
  entry: {
    index: PATH_SRC
  },
  output: {
    filename: '[name].js',
    path: PATH_OUTPUT
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
      typescript: { configFile: PATH_TS_CONFIG }
    }),
    new HtmlPlugin({
      hash: false,
      template: `${PATH_SRC}/index.html`,
      filename: 'index.html'
    })
  ]
}
