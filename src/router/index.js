
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/task',
    name: 'task',
    component: Layout,
    redirect: '/task/mgt',
    meta: { title: '任务', icon: 'component', roles: ['admin', 'editor'] },
    children: [
      {
        name: 'agentMgt',
        path: '/task/agent',
        component: () => import('@/views/task/agent'),
        meta: { title: 'Agent管理', icon: "server", roles: ['admin'] }
      },
      {
        name: 'ansibleMgt',
        path: '/task/ansible',
        component: () => import('@/views/task/ansible'),
        meta: { title: 'Ansible管理', icon: 'ssh', roles: ['admin'] }
      },      
      {
        name: 'taskhistory',
        path: 'task/history',
        component: () => import('@/views/task/history'),
        meta: { title: '操作记录', icon: 'documentation', roles: ['admin', 'editor'] },    
    
      },
      {
        name: 'crontabtask',
        path: 'task/crontab',
        component: () => import('@/views/task/crontab'),
        meta: { title: '计划任务', icon: 'example', roles: ['admin', 'editor'] },    
    
      },             
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
