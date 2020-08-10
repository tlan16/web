<template>
  <div id="oc-file-picker">
    <oc-button v-if="!isAuthenticated" key="login-form" variation="primary" @click="authenticate"
      >Log in</oc-button
    >
    <file-picker key="file-picker" v-else />
  </div>
</template>

<script>
import initVueAuthenticate from './services/auth'
import FilePicker from './components/FilePicker.vue'

export default {
  name: 'App',

  components: {
    FilePicker
  },

  data: () => ({
    authInstance: null,
    isAuthenticated: false,
    bearerToken: ''
  }),

  created() {
    this.init()
  },

  methods: {
    async init() {
      let config = await fetch(window.location.origin + '/file-picker-config.json')

      config = await config.json()
      this.authInstance = initVueAuthenticate(config)
      this.isAuthenticated = this.authInstance.isAuthenticated()

      if (this.isAuthenticated) {
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
      }
    },

    authenticate() {
      this.authInstance.authenticate()
    }
  }
}
</script>
