import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import OwnCloud from 'owncloud-sdk'
import { createStore } from 'vuex-extensions'
import DesignSystem from 'owncloud-design-system'
import GetTextPlugin from 'vue-gettext'

export const createFile = ({ id, status = 1, type = 'folder' }) => ({
  id: `file-id-${id}`,
  type,
  status,
  name: `file-name-${id}`,
  path: `/file-path/${id}`,
  extension: '',
  share: {
    id: `file-share-id-${id}`
  },
  indicators: []
})

export const localVue = createLocalVue()
localVue.prototype.$client = new OwnCloud()
localVue.prototype.$client.init({ baseUrl: 'http://none.de' })
localVue.use(Vuex)
localVue.use(DesignSystem)
localVue.use(GetTextPlugin, {
  translations: 'does-not-matter.json',
  silent: true
})

export const getStore = function({
  highlightedFile = null,
  disablePreviews = true,
  currentPage = null,
  activeFiles = [],
  pages = null,
  sidebarClosed = false,
  currentFolder = null,
  activeFilesCount = null,
  inProgress = [null],
  totalFilesCount = null,
  selectedFiles = [],
  totalFilesSize = null,
  davProperties = [],
  publicLinkPassword = null,
  slogan = null
} = {}) {
  return createStore(Vuex.Store, {
    state: {
      app: { quickActions: {} }
    },
    getters: {
      configuration: () => ({
        options: {
          disablePreviews: disablePreviews
        },
        theme: {
          general: {
            slogan: slogan
          }
        }
      }),
      getToken: () => '',
      isOcis: () => true,
      homeFolder: () => '/'
    },
    modules: {
      Files: {
        state: {
          resource: null,
          currentPage: currentPage,
          filesPageLimit: 100
        },
        getters: {
          totalFilesCount: () => totalFilesCount,
          totalFilesSize: () => totalFilesSize,
          selectedFiles: () => selectedFiles,
          activeFiles: () => activeFiles,
          activeFilesCount: () => activeFilesCount,
          inProgress: () => inProgress,
          highlightedFile: () => highlightedFile,
          pages: () => pages,
          currentFolder: () => currentFolder,
          davProperties: () => davProperties,
          publicLinkPassword: () => publicLinkPassword
        },
        mutations: {
          UPDATE_RESOURCE: (state, resource) => {
            state.resource = resource
          },
          UPDATE_CURRENT_PAGE: () => {},
          SET_FILES_PAGE_LIMIT: () => {},
          CLEAR_FILES_SEARCHED: () => {}
        },
        namespaced: true,
        modules: {
          sidebar: {
            state: {
              closed: sidebarClosed
            },
            namespaced: true
          }
        }
      }
    }
  })
}
