<template>
  <div class="oc-file uk-flex-inline uk-flex-middle uk-width-auto">
    <oc-icon
      key="resource-icon"
      :name="resourceIcon"
      size="medium"
      aria-hidden="true"
      class="uk-margin-small-right"
    />
    <div class="uk-width-expand">
      <div class="file-row-name uk-text-truncate" :filename="item.name">
        <span
          class="uk-text-bold oc-cursor-pointer oc-file-name uk-padding-remove-left"
          role="button"
          v-text="fileName"
        /><span
          v-if="item.extension"
          class="uk-text-meta oc-file-extension"
          v-text="'.' + item.extension"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getResourceIcon } from '../helpers/resources'

export default {
  name: 'Resource',

  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    fileName() {
      return this.item.basename
    },

    resourceIcon() {
      return getResourceIcon(this.item)
    },

    davUrl() {
      const davUrl = ['..', 'dav', 'files', this.$store.getters.user.id].join('/')

      return this.$client.files.getFileUrl(davUrl)
    },

    hasIndicators() {
      return this.indicators.length > 0
    }
  },
  mounted() {
    if (this.displayPreview) {
      this.loadPreview()
    } else {
      this.previewLoaded = 'disabled'
    }
  }
}
</script>
