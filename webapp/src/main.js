// 全局插件
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import App from './App'

// 插件配置
import RouterConfig from './routers'
import Store from './vuex/store'

// 加载插件
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)

// 全局样式
import 'normalize.css'
import 'element-ui/lib/theme-default/index.css'
import './style/main.css'

// 初始化
/* eslint-disable no-new */
new Vue({
  router: new VueRouter({ routes: RouterConfig }),
  store: new Vuex.Store(Store),
  el: '#app',
  render: h => h(App)
})
