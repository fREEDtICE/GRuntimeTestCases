module.exports = {
  // devtool: 'source-map',
  entry: './jelly.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
   
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
    ]
  }
};
