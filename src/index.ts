import retry from 'async-retry'
import { format, parseISO } from 'date-fns'
import spider from './spider'
import { diffFile, getFullPath, sleep } from './util'

async function task(page = 1) {
  const trList = await spider(page)

  const pathMap: Record<string, string[][]> = {}

  trList.forEach((tdList) => {
    const date = tdList[8]
    const filename = format(parseISO(date), 'yyyy-MM-dd')
    const fullPath = getFullPath(filename)
    const current = pathMap[fullPath]
    if (current) {
      current.push(tdList)
    } else {
      pathMap[fullPath] = [tdList]
    }
  })

  const diffArr = await Promise.all(
    Object.entries(pathMap).map(([fullPath, trList]) =>
      diffFile(fullPath, trList)
    )
  )

  let len = 0
  diffArr.forEach((diffList) => (len += diffList.length))

  if (!len) {
    console.log('Everything up-to-date')
    return
  }

  console.log('Diff length', len)

  if (len === trList.length) {
    console.log('Next page', page + 1)
    await sleep(10 * 1e3)
    await task(page + 1)
  }
}

retry(() => task(), {
  retries: 3,
})
