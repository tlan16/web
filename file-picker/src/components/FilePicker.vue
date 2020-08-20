<template>
  <div class="uk-height-1-1 uk-flex uk-flex-column">
    <list-header :current-folder="currentFolder" @openFolder="loadFolder" />
    <div
      v-if="state === 'loading'"
      key="loading-message"
      class="uk-flex uk-flex-1 uk-flex-middle uk-flex-center"
    >
      <oc-spinner aria-label="Loading resources" />
    </div>
    <list-resources
      v-if="state === 'loaded'"
      key="resources-list"
      class="uk-flex-1"
      :resources="resources"
      :current-folder="currentFolder"
      @openFolder="loadFolder"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { buildResource } from '../helpers/resources'
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
    this.loadFolder('/')
  },

  computed: {
    ...mapState(['davProperties'])
  },

  methods: {
    loadFolder(path) {
      this.state = 'loading'
      this.$client.files
        .list(path, 1, this.davProperties)
        .then(resources => {
          resources = resources.map(resource => buildResource(resource))
          this.resources = resources.splice(1)
          this.currentFolder = resources[0]
          this.state = 'loaded'
        })
        .catch(error => {
          console.error(error)
          this.state = 'failed'
        })
    }
  }
}
</script>
