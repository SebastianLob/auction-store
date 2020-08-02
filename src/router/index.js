import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import NotFound from '@/components/404-not-found.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/details/:id',
    name: 'Details',
    props: true,
    component: () => import(/* webpackChunkName: "details" */ '../views/Details.vue')
  },
  {
    path: '/admin-dashboard',
    name: 'Admin',
    // component: Admin,
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin-dashboard.vue')
  },
  {path: '/404-not-found', component: NotFound},
  {path: '*', redirect: '/404-not-found'},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
