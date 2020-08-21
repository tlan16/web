<template>
  <div id="oc-file-picker" class="uk-height-1-1">
    <div
      v-if="state === 'loading'"
      class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-middle uk-flex-center oc-border"
    >
      <oc-spinner label="Loading ownCloud file picker" />
    </div>
    <login v-if="state === 'unauthorized'" key="login-form" @login="authenticate" />
    <file-picker
      class="oc-border uk-height-1-1"
      key="file-picker"
      v-if="state === 'authorized'"
      @selectResources="selectResources"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import sdk from 'owncloud-sdk'
import DesignSystem from 'owncloud-design-system'
import initVueAuthenticate from './services/auth'
import FilePicker from './components/FilePicker.vue'
import Login from './components/Login.vue'

// Init sdk and design system
Vue.prototype.$client = new sdk()
Vue.use(DesignSystem)

export default {
  name: 'App',

  components: {
    FilePicker,
    Login
  },

  data: () => ({
    authInstance: null,
    bearerToken: '',
    state: 'loading'
  }),

  created() {
    this.init()
  },

  methods: {
    async init() {
      let config = await fetch(window.location.origin + '/file-picker-config.json')

      config = await config.json()
      this.authInstance = initVueAuthenticate(config)

      if (this.authInstance.isAuthenticated()) {
        this.bearerToken = this.authInstance.getToken()

        // Init owncloud-sdk
        this.$client.init({
          baseUrl: config.server,
          auth: {
            bearer: this.bearerToken
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })

        this.state = 'authorized'

        return
      }

      this.state = 'unauthorized'
    },

    authenticate() {
      this.authInstance.authenticate()
    },

    selectResources(resources) {
      this.$emit('selectResources', resources)
    }
  }
}
</script>

<style>
/* Import oC CI font and design system styles */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
@import '../node_modules/owncloud-design-system/dist/system/system.css';

* {
  font-family: 'Source Sans Pro', sans-serif;
}
</style>
