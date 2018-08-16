'use strict';
const path = require('path');
module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    'app/app': 'app/web/page/app/app.js'
  },
  alias: {
    app: 'app/web/framework/vue/app.js',
    asset: 'app/web/component/app/assets',
    api: 'app/web/component/app/api',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store',
    vue: 'vue/dist/vue.esm.js',
  },
  dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
  loaders: {
    vue: {
      exclude: []
    }
  },
  plugins: {},
  done() {

  }
};