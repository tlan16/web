<template>
  <div class="uk-height-1-1 uk-flex uk-flex-column">
    <list-header
      :current-folder="currentFolder"
      :is-select-btn-enabled="isSelectBtnEnabled"
      @openFolder="loadFolder"
      @select="emitSelectedResources"
    />
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
      :checkbox-enabled="true"
      @openFolder="loadFolder"
      @selectResources="selectResources"
    />
  </div>
</template>

<script>
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
    currentFolder: null,
    isSelectBtnEnabled: false,
    selectedResources: [],
    davProperties: [
      '{http://owncloud.org/ns}permissions',
      '{http://owncloud.org/ns}favorite',
      '{http://owncloud.org/ns}fileid',
      '{http://owncloud.org/ns}owner-id',
      '{http://owncloud.org/ns}owner-display-name',
      '{http://owncloud.org/ns}share-types',
      '{http://owncloud.org/ns}privatelink',
      '{DAV:}getcontentlength',
      '{http://owncloud.org/ns}size',
      '{DAV:}getlastmodified',
      '{DAV:}getetag',
      '{DAV:}resourcetype'
    ]
  }),

  created() {
    this.loadFolder('/')
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
    },

    selectResources(resources) {
      if (resources.length > 0) {
        this.isSelectBtnEnabled = true
      } else {
        this.isSelectBtnEnabled = false
      }

      this.selectedResources = resources
    },

    emitSelectedResources() {
      this.$emit('selectResources', this.selectedResources)
    }
  }
}
</script>
