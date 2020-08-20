<template>
  <RecycleScroller
    v-if="resources.length"
    v-slot="{ item: rowItem, index, active }"
    :key="resources.length"
    :items="resources"
    :item-size="77"
  >
    <div
      :key="rowItem.viewId"
      :data-is-visible="active"
      :class="{ 'files-list-row-disabled': false }"
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
            :value="selectedFiles.indexOf(rowItem) >= 0"
            :label="labelSelectSingleItem(rowItem)"
            :hide-label="true"
            @click.stop
            @change.native="toggleFileSelect(rowItem)"
          />
        </div>
        <resource :item="rowItem" @navigate="openFolder" />
      </oc-grid>
    </div>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
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

  methods: {
    openFolder(path) {
      this.$emit('openFolder', path)
    },

    selectResource(resource) {
      this.$emit('selectResources', resource)
    }
  }
}
</script>
