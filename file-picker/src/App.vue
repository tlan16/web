<template>
  <div id="oc-file-picker" class="uk-height-1-1">
    <oc-button
      v-if="state === 'unauthorized'"
      key="login-form"
      variation="primary"
      @click="authenticate"
      >Log in</oc-button
    >
    <file-picker class="oc-border uk-height-1-1" key="file-picker" v-if="state === 'authorized'" />
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
    }
  }
}
</script>
