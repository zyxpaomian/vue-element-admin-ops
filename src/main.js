import Vue from 'vue'
import App from './App'

// vxe table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import Cookies from 'js-cookie'

// 封装的axios
import {post, get} from './utils/http'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// elementui 
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import './assets/icon/iconfont.css'
import './icons'

import store from './store'
import router from './router'


import './permission' // permission control
//import './utils/error-log' // error log

//import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.use(VXETable)

require('../mock')

Vue.prototype.$post = post
Vue.prototype.$get = get

// register global utility filters
//Object.keys(filters).forEach(key => {
//  console.log(key)
//  Vue.filter(key, filters[key])
//})

// 显示当前开发模式是开发模式，非生产模式
//Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
