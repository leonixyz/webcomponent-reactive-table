const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'reactive-table.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
