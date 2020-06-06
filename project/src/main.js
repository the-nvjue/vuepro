import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//移动端适配插件
import 'lib-flexible'
//UI库样式
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css';
//全局样式
import './assets/css/global.css'
//字体图标
import './assets/css/iconfont.css'
//axios
import axios from './api'
//
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)


Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
