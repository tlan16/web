<template>
  <div>
    <div v-if="state === 'loading'" key="loading-message" v-text="'Loading'" />
    <div
      class="uk-height-1-1 uk-flex uk-flex-column"
      v-if="state === 'loaded'"
      key="resources-list"
    >
      <list-header :current-folder="currentFolder" />
      <list-resources class="uk-flex-1" :resources="resources" :current-folder="currentFolder" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListResources from './ListResources.vue'
import ListHeader from './ListHeader.vue'

export default {
  name: 'FilePicker',

  components: {
    ListHeader,
    ListResources
  },

  data: () => ({
    state: 'loading',
    resources: [],
    currentFolder: null
  }),

  created() {
    this.$client.files
      .list('/', 1, this.davProperties)
      .then(resources => {
        this.resources = resources.splice(1)
        this.currentFolder = resources[0]
        this.state = 'loaded'
      })
      .catch(error => {
        console.error(error)
        this.state = 'failed'
      })
  },

  computed: {
    ...mapState(['davProperties'])
  }
}
</script>
