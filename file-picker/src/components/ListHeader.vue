<template>
  <header class="uk-background-primary uk-padding-small uk-flex uk-flex-middle uk-flex-between">
    <div>
      <h1 class="uk-margin-small-bottom oc-light">ownCloud</h1>
      <oc-breadcrumb class="oc-light" :items="breadcrumbsItems" />
    </div>
    <div>
      <oc-button
        variation="primary"
        :disabled="!isSelectBtnEnabled"
        :uk-tooltip="disabledSelectBtnTooltip"
        @click.native="select"
        >Select resources</oc-button
      >
    </div>
  </header>
</template>

<script>
import path from 'path'

export default {
  name: 'ListHeader',

  props: {
    currentFolder: {
      type: Object,
      required: false
    },
    isSelectBtnEnabled: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    breadcrumbsItems() {
      let breadcrumbs = [
        {
          text: 'Home',
          onClick: () => this.openFolder('/')
        }
      ]

      if (!this.currentFolder) {
        return breadcrumbs
      }

      const pathSplit = this.currentFolder.path ? this.currentFolder.path.split('/') : []

      for (let i = 1; i < pathSplit.length; i++) {
        let itemPath = encodeURIComponent(path.join.apply(null, pathSplit.slice(0, i + 1)))

        if (i === pathSplit.length - 1) {
          itemPath = null
        }

        breadcrumbs.push({
          index: i,
          text: pathSplit.slice(0, i + 1)[i],
          onClick: () => this.openFolder(itemPath)
        })
      }

      return breadcrumbs
    },

    disabledSelectBtnTooltip() {
      if (this.isSelectBtnEnabled) {
        return null
      }

      return 'Please select at least one resource. You can select a resource by clicking on its row or via its checkbox.'
    }
  },

  methods: {
    openFolder(path) {
      this.$emit('openFolder', path)
    },

    select() {
      this.$emit('select')
    }
  }
}
</script>

<style>
.oc-light .oc-breadcrumb-list-item > a {
  color: white;
}
</style>
