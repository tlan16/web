import Vuex from 'vuex'
import OwnCloud from 'owncloud-sdk'
import { createStore } from 'vuex-extensions'
import { createLocalVue } from '@vue/test-utils'
import DesignSystem from 'owncloud-design-system'
import GetTextPlugin from 'vue-gettext'
import { shareStatus } from '../../../src/helpers/shareStatus.js'

export const stubs = {
  'router-link': true,
  translate: true,
  'oc-pagination': true,
  'oc-table-files': true,
  'oc-spinner': true,
  'context-actions': true,
  'list-loader': true,
  'no-content-message': true
}

export const createShare = ({
  id = '1234',
  itemType = 'file',
  status = shareStatus.accepted
} = {}) => ({
  file_target: '/' + id,
  id: id,
  item_type: itemType,
  status: status,
  share: {
    id: id
  }
})

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
localVue.prototype.$client.requests = {
  ocs: async () => ({
    status: 200,
    headers: {
      get: jest.fn()
    }
  })
}
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
  totalFilesCount = null,
  selectedFiles = [],
  totalFilesSize = null,
  publicLinkPassword = null,
  inProgress = [],
  isOcis = true
} = {}) {
  return createStore(Vuex.Store, {
    state: {
      app: { quickActions: {} }
    },
    getters: {
      configuration: () => ({
        options: {
          disablePreviews: disablePreviews
        }
      }),
      getToken: () => '',
      isOcis: () => isOcis,
      homeFolder: () => '/'
    },
    actions: {
      showMessage: jest.fn()
    },
    modules: {
      Files: {
        state: {
          resource: null,
          currentFolder: currentFolder,
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
          publicLinkPassword: () => publicLinkPassword
        },
        mutations: {
          UPDATE_RESOURCE: (state, resource) => {
            state.resource = resource
          },
          UPDATE_CURRENT_PAGE: jest.fn(),
          SET_FILES_PAGE_LIMIT: jest.fn(),
          CLEAR_FILES_SEARCHED: jest.fn(),
          SELECT_RESOURCES: jest.fn(),
          CLEAR_CURRENT_FILES_LIST: jest.fn(),
          LOAD_FILES: jest.fn(),
          SET_FILE_SELECTION: jest.fn(),
          SET_APP_SIDEBAR_ACTIVE_PANEL: jest.fn()
        },
        actions: {
          loadFiles: jest.fn(),
          loadIndicators: jest.fn()
        },
        namespaced: true,
        modules: {
          sidebar: {
            state: {
              closed: sidebarClosed
            },
            actions: {
              open: jest.fn()
            },
            namespaced: true
          }
        }
      }
    }
  })
}
