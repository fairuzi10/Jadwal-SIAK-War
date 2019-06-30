module.exports = {
  publicPath: './',
  devServer: {
    allowedHosts: [
      '.localhost.run'
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixin.scss";
          @import "@/styles/class.scss";
        `
      }
    }
  }
}
