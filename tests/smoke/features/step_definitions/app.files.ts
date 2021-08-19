import { DataTable, Given, When } from '@cucumber/cucumber'
import { FilesPage, World } from '../../support'
import { expect } from '@playwright/test'

When('{string} navigates to the files page', async function(
  this: World,
  stepUser: string
): Promise<void> {
  const actor = this.actorContinent.get({ id: stepUser })
  const { allFiles: allFilesPage } = new FilesPage({ actor })

  await allFilesPage.navigate()
})

When('{string} navigates to the shared with me page', async function(
  this: World,
  stepUser: string
): Promise<void> {
  const actor = this.actorContinent.get({ id: stepUser })
  const { sharedWithMe: sharedWithMePage } = new FilesPage({ actor })

  await sharedWithMePage.navigate()
})

When('{string} creates following folder(s)', async function(
  this: World,
  stepUser: string,
  stepTable: DataTable
): Promise<void> {
  const actor = this.actorContinent.get({ id: stepUser })
  const { allFiles: allFilesPage } = new FilesPage({ actor })
  const folders = stepTable.raw().map(f => f[0])

  for (const folder of folders) {
    await allFilesPage.createFolder({ name: folder })
  }
})

When('{string} uploads following resource(s)', async function(
  this: World,
  stepUser: string,
  stepTable: DataTable
): Promise<void> {
  const actor = this.actorContinent.get({ id: stepUser })
  const { allFiles: allFilesPage } = new FilesPage({ actor })
  const uploadInfo = stepTable.hashes().reduce((acc, stepRow) => {
    const { to, resource } = stepRow

    if (!acc[to]) {
      acc[to] = []
    }

    acc[to].push(this.fileContinent.get({ name: resource }))

    return acc
  }, {})

  for (const folder of Object.keys(uploadInfo)) {
    await allFilesPage.uploadFiles({ folder, files: uploadInfo[folder] })
  }
})

When('{string} shares following resource(s)', async function(
  this: World,
  stepUser: string,
  stepTable: DataTable
) {
  const actor = this.actorContinent.get({ id: stepUser })
  const { allFiles: allFilesPage } = new FilesPage({ actor })

  const shareInfo = stepTable.hashes().reduce((acc, stepRow) => {
    const { user, resource } = stepRow

    if (!acc[resource]) {
      acc[resource] = []
    }

    acc[resource].push(this.userContinent.get({ id: user }))

    return acc
  }, {})

  for (const folder of Object.keys(shareInfo)) {
    await allFilesPage.shareFolder({ folder, users: shareInfo[folder] })
  }
})

Given('{string} downloads following files', async function(
  this: World,
  stepUser: string,
  stepTable: DataTable
) {
  const actor = this.actorContinent.get({ id: stepUser })
  const { allFiles: allFilesPage } = new FilesPage({ actor })
  const downloadInfo = stepTable.hashes().reduce((acc, stepRow) => {
    const { resource, from } = stepRow

    if (!acc[from]) {
      acc[from] = []
    }

    acc[from].push(resource)

    return acc
  }, {})

  for (const folder of Object.keys(downloadInfo)) {
    const files = downloadInfo[folder]
    const downloads = await allFilesPage.downloadFiles({ folder, names: files })

    expect(files.length).toBe(downloads.length)
    downloads.forEach(download => {
      expect(files).toContain(download.suggestedFilename())
    })
  }
})
