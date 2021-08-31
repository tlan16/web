import PublicLink from '@files/src/views/PublicLink.vue'
import { getStore, localVue } from './views.setup.js'
import { shallowMount, mount } from '@vue/test-utils'

const theme = {
  general: { slogan: 'some-slogan' },
  logo: 'some-logo',
  loginPage: { backgroundImg: 'some-image' }
}

const stubs = {
  'oc-spinner': true,
  translate: true
}

const route = { meta: { title: 'some page title' }, params: { token: 'some-token' } }

const component = { ...PublicLink, mounted: jest.fn(), created: jest.fn() }

const selectors = {
  pageTitle: '[data-testid="public-link-page-title"]',
  loginLogo: '.oc-login-logo',
  loginCardFooter: '.oc-login-card-footer',
  loginCardBody: '.oc-login-card-body',
  errorMessage: '[data-testid="public-link-error-message"]',
  publicLinkPasswordRequired: '[data-testid="public-link-password-required"]',
  loadingText: '[data-testid="public-link-loading-text"]',
  publicLinkErrorMessage: '[data-testid="public-link-error-message"]',
  submitButton: '.oc-login-authorize-button'
}

const spinnerStub = 'oc-spinner-stub'
const textInputStub = 'oc-text-input-stub'

describe('PublicLink', () => {
  describe('theming options', () => {
    const wrapper = getWrapper()
    it('should have the background image set', () => {
      expect(wrapper).toMatchSnapshot()
    })
    it('should display the page title', () => {
      const pageTitle = wrapper.find(selectors.pageTitle)

      expect(pageTitle).toMatchSnapshot()
    })
    it('should display the logo image inside login card', () => {
      const logo = wrapper.find(selectors.loginLogo)

      expect(logo).toMatchSnapshot()
    })
    it('should display the configuration theme general slogan as the login card footer', () => {
      const slogan = wrapper.find(selectors.loginCardFooter)

      expect(slogan).toMatchSnapshot()
    })
  })

  describe('when the view is still loading', () => {
    const wrapper = getWrapper({ loading: true })
    it('should display the loading text with the spinner', () => {
      const loading = wrapper.find(selectors.loginCardBody)

      expect(wrapper.find(spinnerStub).exists()).toBeTruthy()
      expect(loading).toMatchSnapshot()
    })
    it('should not display the error message', () => {
      expect(wrapper.find(selectors.errorMessage).exists()).toBeFalsy()
    })
    it('should not display the password required form', () => {
      expect(wrapper.find(selectors.publicLinkPasswordRequired).exists()).toBeFalsy()
    })
  })

  describe('when the view is not loading anymore', () => {
    it('should not display the loading text and the spinner', () => {
      const wrapper = getWrapper({ loading: false })
      const loading = wrapper.find(selectors.loginCardBody)

      expect(loading.find(selectors.loadingText).exists()).toBeFalsy()
      expect(loading.find(spinnerStub).exists()).toBeFalsy()
    })
    it('should display the error message if "errorMessage" is not empty', async () => {
      const wrapper = getWrapper({ loading: false })
      await wrapper.setData({ errorMessage: 'some-error-message' })

      expect(wrapper.find(selectors.publicLinkErrorMessage).exists()).toBeTruthy()
      expect(wrapper.find(selectors.publicLinkErrorMessage)).toMatchSnapshot()
    })

    describe('when "passwordRequired" is set as true', () => {
      let passwordRequiredForm
      const wrapper = getWrapper({ loading: false })

      beforeEach(async () => {
        await wrapper.setData({ passwordRequired: true })
        passwordRequiredForm = wrapper.find('form')
      })

      it('should display the password required form', () => {
        expect(passwordRequiredForm.exists()).toBeTruthy()
        expect(passwordRequiredForm.find(textInputStub).exists()).toBeTruthy()
        expect(passwordRequiredForm.find('.oc-login-authorize-button').exists()).toBeTruthy()
        expect(passwordRequiredForm).toMatchSnapshot()
      })

      describe('password input', () => {
        it('should have a computed label', () => {
          const passwordInput = passwordRequiredForm.find(textInputStub)
          expect(passwordInput).toMatchSnapshot()
        })
        it('should not display the error message if "inputErrorMessage" is falsy', () => {
          const passwordInput = passwordRequiredForm.find(textInputStub)

          expect(passwordInput.attributes().errormessage).toBeUndefined()
        })
        it('should display the error message if "inputErrorMessage" is not empty', async () => {
          await wrapper.setData({ inputErrorMessage: 'some input error message' })
          const passwordInput = passwordRequiredForm.find(textInputStub)

          expect(passwordInput.attributes().errormessage).toBe('some input error message')
        })
      })

      describe('submit button', () => {
        it('should be set as disabled if "password" is empty', () => {
          expect(wrapper.vm.password).toBeNull()

          const submitButton = wrapper.find(selectors.submitButton)
          expect(submitButton.exists()).toBeTruthy()
          expect(submitButton.attributes().disabled).toBeTruthy()
        })
        it('should be set as enabled if "password" is not empty', async () => {
          await wrapper.setData({ password: 'some-value' })
          expect(wrapper.vm.password).toBe('some-value')

          const submitButton = wrapper.find(selectors.submitButton)
          expect(submitButton.exists()).toBeTruthy()
          expect(submitButton.attributes().disabled).toBeUndefined()
        })
      })

      it('should call "resolvePublicLink" method on form submit', async () => {
        const spyResolvePublicLink = jest.spyOn(PublicLink.methods, 'resolvePublicLink')
        const wrapper = getMountedWrapper({ loading: false })

        await wrapper.setData({ passwordRequired: true, password: 'some-pass' })

        const submitButton = wrapper.find(selectors.submitButton)

        await submitButton.trigger('click')

        expect(spyResolvePublicLink).toHaveBeenCalledTimes(1)
        wrapper.destroy()
      })
    })
  })
})

function getMountOptions({
  $route = route,
  store = getStore({
    theme: theme
  }),
  loading = false
} = {}) {
  return {
    localVue,
    store,
    stubs,
    mocks: {
      $route
    },
    data: () => ({
      loading: loading
    })
  }
}

function getWrapper({ loading, store } = {}) {
  return shallowMount(component, getMountOptions({ store, loading }))
}

function getMountedWrapper({ loading, store } = {}) {
  // https://stackoverflow.com/questions/53382235/trigger-form-submit-on-button-click-in-vue-unit-test
  // Vue Test Utils does not attach DOM nodes to the document by default.
  // This is to avoid enforcing cleanup.
  // You can solve this by setting attachTo to an HTML element when you mount the component
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  return mount(component, {
    ...getMountOptions({ store, loading }),
    attachTo: '#root',
    stubs: {}
  })
}
