// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import store from './store'
import axios from './http'
import VueI18n from 'vue-i18n'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocaleMy from './locale/zh'
import enLocaleMy from './locale/en'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: window.localStorage && localStorage.getItem('locale') || (/zh.*CN/i.test(navigator.language) ? 'zh' :
    'en'),
  messages: {
    'zh': {
      ...zhLocale,
      ...zhLocaleMy,
    },
    'en': {
      ...enLocale,
      ...enLocaleMy,
    },
  },
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueLazyload)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
