import { readFile, writeFile, copyFile } from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from '../src/App.jsx'
import { pageDefinitions } from '../src/content/siteContent.js'

const distDirectory = path.resolve('dist')

for (const page of pageDefinitions) {
  const filePath = path.join(distDirectory, page.output)
  const html = await readFile(filePath, 'utf8')
  const rendered = renderToString(<App pageId={page.id} />)
  const injected = html.replace(
    `<div id="root" data-page="${page.id}"></div>`,
    `<div id="root" data-page="${page.id}">${rendered}</div>`,
  )

  await writeFile(filePath, injected, 'utf8')
}

await copyFile(path.join(distDirectory, 'index.html'), path.join(distDirectory, '404.html'))
