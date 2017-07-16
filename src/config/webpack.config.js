const path = require('path');

const moduleRoot = path.resolve(__dirname, '../../');


module.exports = {
  // The absolute path to for resolving entry points and loaders from this config.
  context: moduleRoot,

  entry: {
    'init': './src/js/createInit.js',
    'main': './src/js/createMain.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(moduleRoot, 'output'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(moduleRoot, 'src', 'js'),
        use: {
          loader: 'babel-loader',
          options: {
            // Avoid needing to run the potentially expensive Babel recompilation process on each run.
            // Since we only specify `true`, it will use the default dir node_modules/.cache/babel-loader.
            cacheDirectory: true,
          }
        }
      },

    ],
  },
};
