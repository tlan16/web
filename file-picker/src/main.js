import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

// Import ownCloud-sdk
import sdk from 'owncloud-sdk'

// Import the Design System
import DesignSystem from 'owncloud-design-system'
import 'owncloud-design-system/dist/system/system.css'

import store from './store'

Vue.config.productionTip = false
Vue.prototype.$client = new sdk()
Vue.use(Vuex)
Vue.use(DesignSystem)

new Vue({
  render: h => h(App),
  store: new Vuex.Store(store)
}).$mount('#app')
