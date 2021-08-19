import { mount } from '@vue/test-utils'
import { localVue, getStore, stubs, createShare } from './views.setup.js'
import SharedWithMe from '@files/src/views/SharedWithMe.vue'
import { shareStatus } from '../../../src/helpers/shareStatus.js'

const sharedWithMeData = [createShare()]

const stubSelectors = {
  listLoader: 'list-loader-stub',
  noContentMessage: 'no-content-message-stub',
  filesTableStub: 'oc-table-files-stub',
  contextActions: 'context-actions-stub',
  listInfo: 'list-info-stub'
}

const selectors = {
  sharedWithMeTable: '#files-shared-with-me-table',
  fileRowShareStatusText: '.file-row-share-status-text',
  acceptShareButton: '[data-testid="file-row-share-accept-button"]',
  declineShareButton: '[data-testid="file-row-share-decline-button"]'
}

describe('SharedWithMe', () => {
  it('should show list loader if loading is set as true', () => {
    stubs['list-loader'] = true
    const wrapper = getMountedWrapper({ loading: true })

    expect(wrapper.find(stubSelectors.listLoader).exists()).toBeTruthy()
  })
  describe('when loading is set as false', () => {
    it('should show no content message if "activeFiles" length is less than one', () => {
      stubs['no-content-message'] = true
      const store = getStore({ activeFiles: [] })
      const wrapper = getMountedWrapper({ loading: false, store })

      expect(wrapper.find(stubSelectors.noContentMessage).exists()).toBeTruthy()
    })
    describe('when "activeFiles" length is greater than one', () => {
      it('should show files table', () => {
        stubs['oc-table-files'] = true
        const wrapper = getMountedWrapper({ loading: false })

        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.exists()).toBeTruthy()
        expect(filesTable.props().resources).toMatchObject(sharedWithMeData)
      })
      it('should set table as squashed if sidebar is not closed', () => {
        stubs['oc-table-files'] = true
        const store = getStore({ sidebarClosed: false, activeFiles: sharedWithMeData })
        const wrapper = getMountedWrapper({ loading: false, store })

        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.attributes().class).toContain('files-table-squashed')
      })
      it('should not set table as squashed if sidebar is closed', () => {
        stubs['oc-table-files'] = true
        const store = getStore({ sidebarClosed: true, activeFiles: sharedWithMeData })
        const wrapper = getMountedWrapper({ loading: false, store })

        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.attributes().class).not.toContain('files-table-squashed')
      })
      it('should display previews if "disablePreviews" config is disabled', () => {
        stubs['oc-table-files'] = true
        const store = getStore({ activeFiles: sharedWithMeData, disablePreviews: false })
        const wrapper = getMountedWrapper({ loading: false, store })
        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.props().areThumbnailsDisplayed).toBeTruthy()
        expect(filesTable.attributes().arethumbnailsdisplayed).toBeTruthy()
      })
      it('should hide previews if "disablePreviews" config is enabled', () => {
        stubs['oc-table-files'] = true
        const store = getStore({ activeFiles: sharedWithMeData, disablePreviews: true })
        const wrapper = getMountedWrapper({ loading: false, store })
        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.props().areThumbnailsDisplayed).toBeFalsy()
        expect(filesTable.attributes().arethumbnailsdisplayed).toBeFalsy()
      })
      it('should set target route to "files-personal"', () => {
        stubs['oc-table-files'] = true
        const store = getStore({ activeFiles: sharedWithMeData, disablePreviews: true })
        const wrapper = getMountedWrapper({ loading: false, store })
        const filesTable = wrapper.find(stubSelectors.filesTableStub)

        expect(filesTable.props().targetRoute).toMatchObject({ name: 'files-personal' })
      })
      it.each([
        { status: shareStatus.accepted, expectedText: 'Accepted' },
        { status: shareStatus.pending, expectedText: 'Pending' },
        { status: shareStatus.declined, expectedText: 'Declined' }
      ])('should show file share status text', input => {
        stubs['oc-table-files'] = false
        const store = getStore({
          activeFiles: [createShare({ status: input.status })]
        })
        const wrapper = getMountedWrapper({ store })

        const filesTable = wrapper.find(selectors.sharedWithMeTable)
        const statusText = filesTable.find(selectors.fileRowShareStatusText)

        expect(statusText.exists()).toBeTruthy()
        expect(statusText.text()).toBe(input.expectedText)
      })

      it('should display context actions', () => {
        stubs['context-actions'] = true
        const store = getStore({
          activeFiles: [createShare()]
        })
        const wrapper = getMountedWrapper({ store })

        const filesTable = wrapper.find(selectors.sharedWithMeTable)
        const contextMenu = filesTable.find(stubSelectors.contextActions)

        expect(contextMenu.props().item).toMatchObject(createShare())
      })

      describe('files table list info component', () => {
        it('should be visible if active files length is greater than zero', () => {
          stubs['list-info'] = true
          const store = getStore({
            activeFiles: [createShare()]
          })
          const wrapper = getMountedWrapper({ store })

          const filesTable = wrapper.find(selectors.sharedWithMeTable)
          const listInfo = filesTable.find(stubSelectors.listInfo)

          expect(listInfo.exists()).toBeTruthy()
          expect(listInfo.props()).toMatchObject({
            files: store.getters['Files/totalFilesCount'].files,
            folders: store.getters['Files/totalFilesCount'].folders,
            size: null
          })
        })
        it('should not be visible if active files length is less than zero', () => {
          stubs['list-info'] = true
          const store = getStore({
            activeFiles: []
          })
          const wrapper = getMountedWrapper({ store })
          const listInfo = wrapper.find(stubSelectors.listInfo)

          expect(listInfo.exists()).toBeFalsy()
        })
      })

      describe('accept share button', () => {
        stubs['oc-table-files'] = false
        it.each([shareStatus.pending, shareStatus.declined])(
          'should be visible if the file share status is declined or pending',
          input => {
            const store = getStore({ activeFiles: [createShare({ id: '1234', status: input })] })
            const wrapper = getMountedWrapper({ store })

            const acceptShareButton = wrapper.find(selectors.acceptShareButton)

            expect(acceptShareButton.exists()).toBeTruthy()
            expect(acceptShareButton.text()).toBe('Accept')
          }
        )
        it('should not exist if the file share status is not declined or pending', () => {
          const store = getStore({
            activeFiles: [createShare({ id: '1234', status: shareStatus.accepted })]
          })
          const wrapper = getMountedWrapper({ store })
          const acceptShareButton = wrapper.find(selectors.acceptShareButton)
          expect(acceptShareButton.exists()).toBeFalsy()
        })
        it('should call "$_acceptShare_trigger" method on click', async () => {
          stubs['oc-button'] = false
          const acceptedShare = createShare({ id: '1234', status: shareStatus.pending })
          const spyAcceptShareTrigger = jest.spyOn(
            SharedWithMe.mixins[1].methods,
            '$_acceptShare_trigger'
          )
          const store = getStore({ activeFiles: [acceptedShare] })
          const wrapper = getMountedWrapper({ store })

          const acceptShareButton = wrapper.find(selectors.acceptShareButton)

          expect(spyAcceptShareTrigger).toHaveBeenCalledTimes(0)

          await acceptShareButton.trigger('click')

          expect(spyAcceptShareTrigger).toHaveBeenCalledTimes(1)
          expect(spyAcceptShareTrigger).toHaveBeenCalledWith(acceptedShare)
        })
      })

      describe('decline share button', () => {
        it.each([shareStatus.accepted, shareStatus.pending])(
          'should be visible if the file share status is pending or accepted',
          inputStatus => {
            const store = getStore({ activeFiles: [createShare({ status: inputStatus })] })
            const wrapper = getMountedWrapper({ store })

            const declineShareButton = wrapper.find(selectors.declineShareButton)

            expect(declineShareButton.exists()).toBeTruthy()
          }
        )
        it('should not be visible if the file share status is not pending or accepted', () => {
          const store = getStore({ activeFiles: [createShare({ status: shareStatus.declined })] })
          const wrapper = getMountedWrapper({ store })

          const declineShareButton = wrapper.find(selectors.declineShareButton)

          expect(declineShareButton.exists()).toBeFalsy()
        })
        it('should call "$_declineShare_trigger" method if clicked', async () => {
          const declinedShare = createShare({ status: shareStatus.pending })
          const spyDeclineShareTrigger = jest.spyOn(
            SharedWithMe.mixins[2].methods,
            '$_declineShare_trigger'
          )
          const store = getStore({ activeFiles: [declinedShare] })
          const wrapper = getMountedWrapper({ store })

          expect(spyDeclineShareTrigger).toHaveBeenCalledTimes(0)

          const declineShareButton = wrapper.find(selectors.declineShareButton)
          await declineShareButton.trigger('click')

          expect(spyDeclineShareTrigger).toHaveBeenCalledTimes(1)
          expect(spyDeclineShareTrigger).toHaveBeenCalledWith(declinedShare)
        })
      })
    })
  })

  function mountOptions({
    store = getStore({ activeFiles: sharedWithMeData }),
    route = {
      name: 'test-route',
      params: {
        page: 1
      }
    },
    loading = false
  }) {
    return {
      localVue,
      store,
      stubs,
      mocks: {
        $route: route
      },
      data: () => ({
        loading: loading
      })
    }
  }

  function getMountedWrapper({ store, route, loading } = {}) {
    const component = { ...SharedWithMe, created: jest.fn(), mounted: jest.fn() }
    return mount(component, mountOptions({ store, route, loading }))
  }
})
