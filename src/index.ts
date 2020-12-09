import retry from 'async-retry'
import { readFile, writeFile } from 'fs/promises'
import spider from './spider'
import { diffSource, exists, getFullPath, sleep } from './util'

async function task(boil: (e: Error) => void, page = 1) {
  const trList = await spider(page)

  const fullPath = getFullPath(new Date())

  let source = ''
  if (await exists(fullPath)) {
    const fileText = await readFile(fullPath)
    const decoder = new TextDecoder()
    source = decoder.decode(fileText)
  }

  const diffList = diffSource(source, trList)

  if (!diffList.length) {
    console.log('Everything up-to-date')
    return
  }

  console.log('Diff length', diffList.length)

  const diffStr = diffList.map((td) => td.join(' | ')).join('\n')
  const newSource = diffStr + '\n' + source
  await writeFile(fullPath, newSource)

  if (diffList.length === trList.length) {
    console.log('Next page')
    await sleep(30 * 1e3)
    await task(boil, page + 1)
  }
}

retry(task, {
  retries: 3,
})
