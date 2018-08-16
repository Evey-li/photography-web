import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from './pages/Index';
import Login from './pages/login.vue';
import Gallery from './pages/gallery.vue';
import DemandMarket from './pages/demandMarket.vue';
import CreatDemand from './pages/creatDemand.vue';
import DemandDetail from './pages/demandDetail.vue';
import User from './pages/user.vue';
import DemandMgmt from './pages/demandMgmt.vue';
import Settings from './pages/settings.vue';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Index,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/gallery',
    component: Gallery,
  },
  {
    path: '/creatDemand',
    component: CreatDemand,
  },
  {
    path: '/demandMarket',
    component: DemandMarket,
  },
  {
    path: '/demandDetail/:id',
    name: 'detail',
    component: DemandDetail,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '/user/:id',
    name: 'user',
    component: User,
  },
  {
    path: '/demandMgmt',
    component: DemandMgmt,
  },
  {
    path: '/settings',
    component: Settings,
  }
  ]
});

export default router;