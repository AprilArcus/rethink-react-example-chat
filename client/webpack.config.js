import path from 'path';
import webpack from 'webpack';

export default {
  devtool: 'cheap-module-source-map',
  entry: [
    './client/src/app',
    'webpack-hot-middleware/client'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
      '.json',
      '.coffee',
      '.coffee.md',
      '.litcoffee',
      '.cson'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          optional: ['runtime'],
          cacheDirectory: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.coffee$/,
        loader: 'coffee'
      },
      {
        test: /\.(coffee\.md|litcoffee)$/,
        loader: 'coffee?literate'
      },
      {
        test: /\.cson$/,
        loader: 'cson'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ]
      }
    ]
  }
};
