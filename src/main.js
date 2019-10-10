import Vue from 'vue'
import App from './App.vue'

import $$ from '@/assets/js/methods'

import './assets/css/css.css'

Vue.config.productionTip = false

Vue.prototype.$$ = $$

new Vue({
  render: h => h(App),
}).$mount('#app')
