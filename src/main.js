import Vue from 'vue'
import App from './App'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import Cookies from 'js-cookie'


import {post, get} from './utils/http'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import './assets/icon/iconfont.css'

import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control


import './utils/error-log' // error log

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(VXETable)

require('../mock')

Vue.prototype.$post = post
Vue.prototype.$get = get

// register global utility filters
Object.keys(filters).forEach(key => {
  console.log(key)
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
