import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // 全局CSS
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN' // 长18岁
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // CSS重置的现代替代方法
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'video.js/dist/video-js.css'

  const { mockXHR } = require('../mock')
  mockXHR()

Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
