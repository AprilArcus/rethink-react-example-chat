import path from 'path';
import webpack from 'webpack';
import serverConfig from '../server/config.json';

export default {
  devtool: 'eval',
  entry: [
    './client/src/app.js',
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
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          'babel'
          // , 'eslint'
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
};
