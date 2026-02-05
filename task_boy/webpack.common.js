import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@controllers": path.resolve(import.meta.dirname, "src/controllers"),
      "@models": path.resolve(import.meta.dirname, "src/models"),
      "@views": path.resolve(import.meta.dirname, "src/views"),
    },
  },
};
