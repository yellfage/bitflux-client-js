const path = require('path')
const { SourceMapDevToolPlugin } = require('webpack')

const { NODE_ENV } = process.env

const SRC_PATH = path.resolve(__dirname, 'src')
const OUTPUT_PATH = path.resolve(__dirname, 'dist')

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
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: 'esnext',
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
  ],
}
