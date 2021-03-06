import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/redirect',
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/redirect/index')
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/components/views/home')
    },
    {
      path: '/test',
      component: () => import('@/components/views/test')
    },
    {
      path: '/404',
      component: () => import('@/components/error-page/404')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
