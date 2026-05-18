import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defaultSiteContent } from '../src/content/defaultContent.js'
import { collectImageAssets } from '../src/content/contentModel.js'

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backup = {
  content: defaultSiteContent,
  createdAt: new Date().toISOString(),
  imageAssets: collectImageAssets(defaultSiteContent),
  source: 'src/content/siteContent.js',
}

mkdirSync(resolve('backups'), { recursive: true })

const backupPath = resolve('backups', `site-content-default-backup-${timestamp}.json`)
writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8')

console.log(`Backed up default site content to ${backupPath}`)
