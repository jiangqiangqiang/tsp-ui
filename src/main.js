// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import Loading from './components/Loading'
// import VeeValidate from 'vee-validate'
import './assets/reset.css'
import './assets/border.css'
import 'element-ui/lib/theme-chalk/index.css'
// eslint-disable-next-line
import '!style-loader!css-loader!less-loader!./assets/less/common.less'
import settings from './settings'
import { Getitem, Removeitem } from './services/CommonService'
import mixins from './mixins'
import filters from './filters'
import store from '@/vuex/store'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Button from './components/Button'
import './assets/icons'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'
import marked from 'marked/lib/marked'

Vue.use(VueAxios, axios)
Vue.axios = axios
Vue.use(ElementUI)
// Vue.use(VeeValidate)
Vue.mixin(mixins)
Vue.mixins = mixins
Vue.use(filters)
Vue.component('Loading', Loading)
Vue.component('Button', Button)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

Vue.directive('highlight', (el) => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})
Vue.prototype.marked = marked

window.Promise = Promise
// axios.defaults.baseURL = settings.domain.domain
axios.defaults.validateStatus = function (status) {
  return status <= 403
}
const ENV = process.env.NODE_ENV
if (ENV === 'development') {
  Vue.config.productionTip = false
} else {
  Vue.config.productionTip = true
}

axios.interceptors.request.use((config) => {
  const token = Getitem('token')
  // 如果带有下载的header头,直接return
  if (config.headers.FileToken) {
    return config
  }
  if (token && router.history.current.path !== '/helper') {
    config.headers.Authorization = `Bearer ${token}`
  } else if (router.history.current.path !== '/helper') {
    Removeitem('token')
  }
  // 根据不同情况配置不同baseUrl
  // domain 和 adminDomain
  let userData = Getitem('userData')
  // add domain
  if (userData) {
    if (Vue.mixins.methods.getUserRole().toLowerCase() === 'admin') {
      config.baseURL = settings.domain.adminDomain
    } else {
      config.baseURL = settings.domain.domain
    }
  } else {
    config.baseURL = settings.domain.domain
  }
  if (router.history.current.path === '/helper') config.baseURL = settings.domain.helpUrl
  return config
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
