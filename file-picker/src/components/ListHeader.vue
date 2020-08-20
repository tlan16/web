<template>
  <header class="uk-background-muted uk-padding-small">
    <h1>ownCloud</h1>
    <oc-breadcrumb :items="breadcrumbsItems" />
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
    }
  },

  methods: {
    openFolder(path) {
      this.$emit('openFolder', path)
    }
  }
}
</script>
