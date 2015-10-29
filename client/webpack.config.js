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
          cacheDirectory: true,
          optional: ['runtime'],
          stage: 2,
          loose: 'all',
          plugins: ['react-transform'],
          extra: {
            'react-transform': {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module']
              }, {
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react']
              }]
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.coffee$/,
        loaders: ['react-hot', 'coffee']
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
