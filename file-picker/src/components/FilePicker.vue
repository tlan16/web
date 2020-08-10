<template>
  <div>
    <div v-if="state === 'loading'" key="loading-message" v-text="'Loading'" />
    <list-resources v-if="state === 'loaded'" key="resources-list" :resources="resources" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListResources from './ListResources.vue'

export default {
  name: 'FilePicker',

  components: {
    ListResources
  },

  data: () => ({
    state: 'loading',
    resources: []
  }),

  created() {
    this.$client.files
      .list('/', 1, this.davProperties)
      .then(resources => {
        this.resources = resources
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
