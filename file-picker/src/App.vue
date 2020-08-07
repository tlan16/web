<template>
  <div id="oc-file-picker">
    <oc-button variation="primary" v-if="!isAuthenticated" @click="authenticate">Log in</oc-button>
    <div v-else>Hello world</div>
  </div>
</template>

<script>
import initVueAuthenticate from './services/auth'

export default {
  name: 'App',

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
      }
    },

    authenticate() {
      this.authInstance.authenticate()
    }
  }
}
</script>
