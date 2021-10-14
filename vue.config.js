module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
};
