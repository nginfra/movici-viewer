const path = require('path');

module.exports = {
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
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks.chunks = 'all';
    }

    config.resolve.alias['~flow'] = path.join(__dirname, 'movici-flow-common/src/');
  }
};
