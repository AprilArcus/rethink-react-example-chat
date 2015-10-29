import path from 'path';
import webpack from 'webpack';
import serverConfig from '../server/config';

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
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify({
        apiServer: {
          protocol: 'http:',
          hostname: 'localhost',
          path: '/db',
          port: serverConfig.webPort
        }
      })
    }),
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
        loaders: [
          'babel'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.coffee$/,
        loaders: [
          'coffee'
        ]
      },
      {
        test: /\.(coffee\.md|litcoffee)$/,
        loaders: [
          'coffee?literate'
        ]
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
