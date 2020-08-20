<template>
  <RecycleScroller
    v-if="builtResources.length"
    v-slot="{ item: rowItem, index, active }"
    :key="builtResources.length"
    class="uk-height-1-1"
    :items="builtResources"
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
        <resource :item="rowItem" />
        <div
          class="uk-text-meta uk-text-nowrap uk-width-small uk-text-right"
          :class="{ 'uk-visible@s': !_sidebarOpen, 'uk-hidden': _sidebarOpen }"
          v-text="getResourceSize(rowItem.size)"
        />
        <div
          class="uk-text-meta uk-text-nowrap uk-width-small uk-text-right"
          :class="{ 'uk-visible@s': !_sidebarOpen, 'uk-hidden': _sidebarOpen }"
          v-text="formDateFromNow(rowItem.mdate)"
        />
      </oc-grid>
    </div>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { buildResource, getResourceSize } from '../helpers/resources'
import { formDateFromNow } from '../helpers/date'
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

  computed: {
    builtResources() {
      return this.resources.map(resource => buildResource(resource))
    }
  },

  methods: {
    getResourceSize(size) {
      return getResourceSize(size)
    },

    formDateFromNow(date) {
      return formDateFromNow(date)
    }
  }
}
</script>
