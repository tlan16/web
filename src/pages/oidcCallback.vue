<template>
  <div
    class="oc-login"
    :style="{ backgroundImage: 'url(' + backgroundImg + ')' }"
    uk-height-viewport
  >
    <div class="oc-login-card uk-position-center">
      <img class="oc-login-logo" :src="logoImg" :alt="configuration.theme.general.name" />
      <div v-show="error" class="oc-login-card-body">
        <h3 class="oc-login-card-title">
          <translate>Authentication failed</translate>
        </h3>
        <p v-translate>
          Please contact the administrator if this error persists.
        </p>
      </div>
      <div v-show="!error" class="oc-login-card-body">
        <h3 class="oc-login-card-title">
          <translate>Redirecting</translate>
        </h3>
        <p v-translate>
          Please wait a while. You are being redirected.
        </p>
      </div>
      <div class="oc-login-card-footer">
        <p>
          {{ configuration.theme.general.slogan }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'OidcCallbackPage',
  data() {
    return {
      error: false
    }
  },

  computed: {
    ...mapGetters(['configuration']),
    ...mapState(['user']),

    backgroundImg() {
      return this.configuration.theme.loginPage.backgroundImg
    },

    logoImg() {
      return this.configuration.theme.logo.login
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.error) {
        this.error = true

        return console.warn(
          'OAuth error: ' + this.$route.query.error + ' - ' + this.$route.query.error_description
        )
      }

      if (this.$route.path === '/oidc-silent-redirect') {
        return this.$auth.mgr.signinSilentCallback().then(() => {
          this.initAuth(false)
        })
      }

      this.callback()
    })
  },

  methods: {
    ...mapActions(['clearUserState']),
    ...mapMutations(['UPDATE_TOKEN', 'SET_CAPABILITIES', 'SET_USER', 'SET_USER_READY']),

    callback() {
      this.$auth.mgr
        .signinRedirectCallback()
        .then(() => {
          this.initAuth()
        })
        .catch(e => {
          console.warn('error in OpenIdConnect:', e)
          this.clearUserState()
          this.$router.push({ name: 'accessDenied' })
        })
    },

    initAuth(autoRedirect = true) {
      this.$auth.events().addUserLoaded(user => {
        console.log(
          `New User Loaded. access_token： ${user.access_token}, refresh_token: ${
            user.refresh_token
          }`
        )
        this.initSdk(user.access_token)
        this.UPDATE_TOKEN(user.access_token)
      })
      this.$auth.events().addUserUnloaded(() => {
        console.log('user unloaded…')
        this.clearUserState()
        this.$router.push({ name: 'login' })
      })
      this.$auth.events().addSilentRenewError(error => {
        console.error('Silent Renew Error：', error)
        this.clearUserState()
        this.$router.push({ name: 'accessDenied' })
      })

      const token = this.$auth.getToken()

      if (token) {
        this.initSdk(token)
        this.initApp(autoRedirect)
      }
    },

    initSdk() {
      const instance = this.configuration.server
      const options = {
        baseUrl: instance,
        auth: {
          bearer: this.user.token
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }

      if (this.user.id) {
        options.userInfo = {
          id: this.user.id,
          'display-name': this.user.displayname,
          email: this.user.email
        }
      }

      this.$client.init(options)
    },

    async initApp(autoRedirect) {
      let login

      try {
        login = await this.$client.login()
      } catch (e) {
        console.warn('Seems that your token is invalid. Error:', e)
        this.clearUserState()
        this.$router.push({ name: 'accessDenied' })

        return
      }

      const capabilities = await this.$client.getCapabilities()

      this.SET_CAPABILITIES(capabilities)

      const userGroups = await this.$client.users.getUserGroups(login.id)

      this.SET_USER({
        id: login.id,
        username: login.username,
        displayname: login.displayname || login['display-name'],
        email: !Object.keys(login.email).length ? '' : login.email,
        token: this.user.token,
        isAuthenticated: true,
        groups: userGroups
      })

      await this.loadSettingsValues()
      this.SET_USER_READY(true)

      if (autoRedirect) {
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>
