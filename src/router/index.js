import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: resolve => require(['../pages/index.vue'], resolve)
  },
  {
    path: '/make/out-order',
    name: 'MakeOutOrder',
    component: resolve => require(['../pages/make/out-order.vue'], resolve)
  },
  {
    path: '/invoice/detail',
    name: 'InvoiceDetail',
    component: resolve => require(['../pages/invoice/detail.vue'], resolve)
  },
  {
    path: '/address/',
    name: 'Address',
    component: resolve => require(['../pages/address/list.vue'], resolve)
  },
  {
    path: '/company/',
    name: 'Company',
    component: resolve => require(['../pages/company/list.vue'], resolve)
  },
  {
    path: '/make/merge-make',
    name: 'MergeMake',
    component: resolve => require(['../pages/make/merge-make.vue'], resolve)
  },
  {
    path: '/make/single-order',
    name: 'MakeSingleOrder',
    component: resolve => require(['../pages/make/single-order.vue'], resolve)
  },
  {
    path: '/make/single-query-order',
    name: 'MakeSingleQueryOrder',
    component: resolve => require(['../pages/make/single-query-order.vue'], resolve)
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
