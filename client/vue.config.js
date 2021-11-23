// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  publicPath: './',
  lintOnSave: 'warning',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./movici-flow-common/src/assets/sass/variables.scss";`
      }
    }
  },
  configureWebpack: () => {
    return {
      optimization: {
        splitChunks: {
          chunks: process.env.NODE_ENV === 'production' ? 'all' : 'async' // async is webpack default
        }
      },
      resolve: {
        alias: { '@movici-flow-common': path.join(__dirname, 'movici-flow-common/src/') }
      },
      devServer: {
        watchOptions: {
          ignored: /node_modules/
        }
      }
    };
  }
};
