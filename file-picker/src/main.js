import Vue from 'vue'
import App from './App.vue'

// Import ownCloud-sdk
import sdk from 'owncloud-sdk'

// Import the Design System
import DesignSystem from 'owncloud-design-system'
import 'owncloud-design-system/dist/system/system.css'

Vue.config.productionTip = false
Vue.prototype.$client = new sdk()
Vue.use(DesignSystem)

new Vue({
  render: h => h(App)
}).$mount('#app')
