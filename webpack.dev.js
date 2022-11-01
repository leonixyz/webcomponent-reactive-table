const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'reactive-table.js',
    clean: true
  },
  devServer: {
    static: './public',
    port: 8998,
    hot: true
  },
  devtool: 'inline-source-map',
};
