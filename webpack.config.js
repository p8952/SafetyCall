const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react"]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};