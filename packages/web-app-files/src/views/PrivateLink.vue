<template>
  <div
    class="oc-login"
    uk-height-viewport
    :style="{ backgroundImage: 'url(' + backgroundImg + ')' }"
  >
    <h1 class="oc-invisible-sr">{{ pageTitle }}</h1>
    <div class="oc-login-card uk-position-center">
      <img class="oc-login-logo" :src="logoImg" alt="" :aria-hidden="true" />
      <div v-if="loading" class="oc-login-card-body">
        <h2 class="oc-login-card-title">
          <translate>Resolving private link…</translate>
        </h2>
        <oc-spinner :aria-hidden="true" />
      </div>
      <div v-if="errorMessage" class="oc-login-card-body">
        <h2 class="oc-login-card-title">
          <translate>An error occurred while resolving the private link</translate>
        </h2>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import { buildResource } from '../helpers/resources'

export default {
  data() {
    return {
      loading: true,
      errorMessage: null
    }
  },
  computed: {
    ...mapGetters(['configuration', 'homeFolder']),
    ...mapGetters('Files', ['davProperties']),

    pageTitle() {
      return this.$gettext(this.$route.meta.title)
    },

    backgroundImg() {
      return this.configuration.theme.loginPage.backgroundImg
    },

    logoImg() {
      return this.configuration.theme.logo.login
    }
  },
  async mounted() {
    // query server to translate fileId to real path
    this.loading = true
    try {
      const resourcePath = await this.$client.files.getPathForFileId(this.$route.params.fileId)
      let resource = await this.$client.files.fileInfo(resourcePath, this.davProperties)
      resource = buildResource(resource)
      const route = {
        name: 'files-personal'
      }

      if (resource.type === 'folder') {
        // if folder: route directly into it
        route.params = {
          item: resource.path || this.homeFolder
        }
      } else {
        // if file: route into parent and highlight file
        route.params = {
          item: path.dirname(resource.path)
        }
        route.query = {
          scrollTo: resource.name
        }
      }

      await this.$router.push(route)
    } catch (error) {
      this.errorMessage = error
      this.loading = false
    }
  }
}
</script>
