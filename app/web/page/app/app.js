import {
  sync
} from 'vuex-router-sync';
import store from 'store/app';
import router from 'component/app/router';
import app from './app.vue';
import App from 'app';
import Toasted from 'vue-toasted';
import Vue from 'vue';
import Vuex from 'vuex';

import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';

Vue.use(VueAreaLinkage);
Vue.use(Vuex);
Vue.use(Toasted, {
  position: 'top-center',
  duration: 5000,
});
// import Layout from 'component/layout/app';

// App.component(Layout.name, Layout);

sync(store, router);

export default App.init({
  base: '/app',
  ...app,
  router,
  store
});