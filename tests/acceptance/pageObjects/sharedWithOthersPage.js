const navigationHelper = require('../helpers/navigationHelper')
const { join } = require('../helpers/path')

module.exports = {
  url: function() {
    return join(this.api.launchUrl, '/#/files/list/shared-with-others/')
  },
  commands: {
    /**
     * like build-in navigate() but also waits till for the progressbar to appear and disappear
     * @returns {*}
     */
    navigateAndWaitTillLoaded: function() {
      return navigationHelper.navigateAndWaitTillLoaded(
        this.url(),
        this.page.FilesPageElement.filesList().elements.filesListProgressBar
      )
    },
    getCollaboratorsForResource: async function(fileName) {
      const collaborators = []
      const requiredXpath =
        this.api.page.FilesPageElement.filesList().getFileRowSelectorByFileName(fileName) +
        this.elements.collaboratorsInFileRow.selector
      await this.waitForElementVisible({
        locateStrategy: this.elements.collaboratorsInFileRow.locateStrategy,
        selector: requiredXpath
      })
      await this.api.elements(
        this.elements.collaboratorsInFileRow.locateStrategy,
        requiredXpath,
        elements => {
          elements.value.forEach(el => {
            this.api.elementIdAttribute(el.ELEMENT, 'aria-label', r => {
              collaborators.push(r.value)
            })
          })
        }
      )
      return collaborators
    }
  },
  elements: {
    collaboratorsInFileRow: {
      selector: '//div[contains(@class, "oc-table-files-people")]//div',
      locateStrategy: 'xpath'
    }
  }
}