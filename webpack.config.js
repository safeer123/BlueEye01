const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WebpackMerge = require("webpack-merge");
const Webpack = require("webpack");
const path = require("path");
const webAppPath = "./src";
const appEntry = "/index.js";
const htmlTemplatePath = "./public/index.html";

const devConfig = () => ({
  devtool: "eval-source-map",
  devServer: {
    contentBase: "dist",
    compress: true,
    port: process.env.port,
    stats: "errors-only",
    open: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
      //"/signalr/**": "http://bsrrmtddbint01.corp.optym.net/rmt_api/",
      //'/rmt_api/signalr/**': "http://bsrrmtddbint01.corp.optym.net/rmt_api/signalr/",
      //"/api": "http://bsrrmtddbint01.corp.optym.net/rmt_api/",
      //"/token": "http://bsrrmtddbint01.corp.optym.net/rmt_api/"

      "/signalr": "http://localhost:61852/signalr",
      "/api": "http://localhost:61852/",
      "/token": "http://localhost:61852/"
    }
  }
});
const prodConfig = () => ({
  devtool: "source-map",
  plugins: [
    // new Webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false
    //   },
    //   sourceMap: false
    // })
  ]
});

const commonConfig = () => ({
  entry: {
    bundle: ["babel-polyfill", webAppPath + appEntry],
    vendor: ["axios", "react", "react-bootstrap", "react-dom"]
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  
  module: {
    rules: [
      { test: /\.js|.jsx$/, use: "babel-loader", exclude: [path.resolve(__dirname, "node_modules")] },
     
      {
        test: /\.json$/,
        use: "json-loader"
      },

      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"],
          allChunks:true
        })
      },
      // {
      //   test: /\.css$/,
      //   use: [ 'style-loader', 'css-loader' ]
      // },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "fonts/[name].[ext]?[hash]"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "images/[name].[ext]?[hash]"
            }
          }
        ]
      },
      // {
      //   test: require.resolve("numbro"),
      //   use: "expose-loader?numbro"
      // },
      {
        test: require.resolve("moment"),
        use: "expose-loader?moment"
      },
      {
        test: require.resolve("pikaday"),
        use: "expose-loader?Pikaday"
      },
      {
        test: /\.(c|d|t)sv$/, // load all .csv, .dsv, .tsv files with dsv-loader
        use: ['dsv-loader'] // or dsv-loader?delimiter=,
      }
      // {
      //   test: require.resolve("zeroclipboard"),
      //   use: "expose-loader?ZeroClipboard"
      // },
      // {
      //   test: require.resolve("hot-formula-parser/dist/formula-parser.js"),
      //   use: "expose-loader?formulaParser"
      // }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplatePath
    }),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false,
      exclude: ["node_modules"]
    }),
    new ExtractTextPlugin({
      // `allChunks` is needed with CommonsChunkPlugin to extract
      // from extracted chunks as well.
      allChunks: true,
      filename: "styles.[chunkhash].css",
    }),
    new CopyWebpackPlugin([
      {
        from: __dirname + "/src/images",
        to: __dirname + "/dist/images/"
      }
    ]),
   // new BundleAnalyzerPlugin(),
    new Webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      // filename: 'vendor.js',
      minChunks: function(module) {
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new Webpack.ProvidePlugin({
      ReactDOM: "react-dom",
      React: "react"
    })
  ]
});

module.exports = env => {
  if (env.prod === "true") {
    return WebpackMerge(commonConfig(), prodConfig());
  }
  return WebpackMerge(commonConfig(), devConfig());
};