const path = require('path')
const webpack = require('webpack')
const manifestJson = require('./manifest.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const ZipPlugin = require('zip-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CraftExtensionApiPlugin } = require('@craftdocs/craft-extension-api-sdk')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  return {
    entry: {
      app: './src/index.ts'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      fallback: {
        'http': require.resolve('stream-http'),
        'stream': require.resolve('stream-browserify'),
        'https': require.resolve('https-browserify'),
        'util': require.resolve('util/'),
        'zlib': require.resolve('browserify-zlib'),
        'crypto': require.resolve('crypto-browserify')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
          // Enables including CSS by doing "import './file.css'" in your TypeScript code
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        // Allows you to use import in your code to get a data URI
        {
          test: /\.(svg|png|bmp|jpg|jpeg|webp|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100000000,
              },
            },
          ],
        }
      ]
    },
    plugins: [
      new CraftExtensionApiPlugin(),
      new webpack.DefinePlugin({
        'global': {} // Fix missing symbol error when running in developer VM
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new HtmlWebpackPlugin({
        inject: 'body',
        template: path.resolve(__dirname, 'src/index.html'),
        chunks: ['app']
      }),
      isProd && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/app/]),
      isProd && new CopyPlugin({
        patterns: [
          { from: 'manifest.json' },
          { from: 'icon.png' }
        ],
      }),
      isProd && new ZipPlugin({
        filename: manifestJson.fileName,
        extension: 'craftx',
        include: [
          'app.js.LICENSE.txt',
          'index.html',
          'manifest.json',
          'icon.png'
        ]
      })
    ].filter(Boolean)
  }
}
