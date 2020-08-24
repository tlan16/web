<template>
  <RecycleScroller
    v-if="resources.length"
    v-slot="{ item: rowItem, index, active }"
    :key="resources.length"
    :items="resources"
    :item-size="68"
  >
    <div
      :key="rowItem.viewId"
      :data-is-visible="active"
      :class="{
        'files-list-row-disabled': false,
        'oc-background-selected': isResourceSelected(rowItem)
      }"
      class="oc-cursor-pointer"
      @click="selectResource(rowItem)"
    >
      <oc-grid
        :id="'file-row-' + rowItem.id"
        :ref="index === 0 ? 'firstRow' : null"
        gutter="small"
        flex
        class="uk-padding-small oc-border-top"
        @click="selectResource(rowItem)"
      >
        <div v-if="checkboxEnabled">
          <oc-checkbox
            class="uk-margin-small-left"
            :value="isResourceSelected(rowItem)"
            :label="selectCheckboxLabel(rowItem.name)"
            :hide-label="true"
            @click.stop
            @change.native="selectResource(rowItem)"
          />
        </div>
        <resource :item="rowItem" @navigate="openFolder" />
      </oc-grid>
    </div>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import Resource from './Resource.vue'

export default {
  name: 'ListResources',

  components: {
    RecycleScroller,
    Resource
  },

  props: {
    resources: {
      type: Array,
      required: true
    },
    checkboxEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
    currentFolder: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    selectedResources: []
  }),

  methods: {
    openFolder(path) {
      this.$emit('openFolder', path)
    },

    selectResource(resource) {
      if (this.isResourceSelected(resource)) {
        this.selectedResources.splice(this.selectedResources.indexOf(resource), 1)
      } else {
        this.selectedResources.push(resource)
      }

      this.$emit('selectResources', this.selectedResources)
    },

    selectCheckboxLabel(name) {
      return `Select ${name}`
    },

    isResourceSelected(resource) {
      return this.selectedResources.indexOf(resource) > -1
    }
  }
}
</script>

<style scoped>
@import '../../node_modules/vue-virtual-scroller/dist/vue-virtual-scroller.css';
</style>
