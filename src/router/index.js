import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: resolve => require(['../pages/index.vue'], resolve)
  },
  {
    path: '/out-order',
    name: 'out-order',
    component: resolve => require(['../pages/make/out-order.vue'], resolve)
  },
  {
    path: '/invoice/e/detail',
    name: 'invoice-e-detail',
    component: resolve => require(['../pages/invoice/e/detail.vue'], resolve)
  },
  {
    path: '/address',
    name: 'address',
    component: resolve => require(['../pages/address.vue'], resolve)
  },
  {
    path: '/company',
    name: 'company',
    component: resolve => require(['../pages/company.vue'], resolve)
  },
  {
    path: '/make',
    name: 'make',
    component: resolve => require(['../pages/make/make.vue'], resolve)
  },
  {
    path: '/single-order',
    name: 'single-order',
    component: resolve => require(['../pages/make/single-order.vue'], resolve)
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
