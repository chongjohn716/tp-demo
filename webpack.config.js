var path = require("path");

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const config = {
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "jtopo-min.js",
    library: 'JTopo',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },

  devServer: {
    contentBase: path.join(__dirname, "./public"),
    clientLogLevel: 'warning',
    historyApiFallback: true,
    // hot: true,
    compress: true,
    host: 'localhost',
    port: 8089,
    before: function (app) {
      app.get('/demo/js/jtopo-min.js', function (req, res) {
        res.redirect('/jtopo-min.js')
      });
    }
  },

  plugins: [

  ],
  module: {
    rules: [
      // {
      //   test: /\.(js)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter'),
      //     emitWarning: true
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}

// console.log(config)

module.exports = config
