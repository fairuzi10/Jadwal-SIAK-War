const PrerenderSPAPlugin = require('prerender-spa-plugin')
const path = require('path')

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
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'dist'),
            routes: [ '/', '/create', '/schedule/' ]
          })
        ],
        performance: {
          maxEntrypointSize: 1024000,
          maxAssetSize: 512000
        }
      }
    } else {
      return {}
    }
  }
}
