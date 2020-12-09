import Bot from '@xg4/dingtalk-bot'
import retry from 'async-retry'
import { format, parseISO } from 'date-fns'
import { SECRET, WEBHOOK } from './config'
import spider from './spider'
import { diffFile, getFullPath, renderContent, sleep } from './util'

const bot = new Bot(WEBHOOK, SECRET)

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

  let diffLength = 0

  await Promise.all(
    diffArr.map(async (diffList) => {
      diffLength += diffList.length
      await Promise.all(
        diffList.map((tdList) => {
          const [title, text] = renderContent(tdList)
          return bot.markdown({
            title,
            text,
          })
        })
      )
    })
  )

  if (!diffLength) {
    console.log('Everything up-to-date')
    return
  }

  console.log('Diff length', diffLength)

  if (diffLength === trList.length) {
    console.log('Next page', page + 1)
    await sleep(10 * 1e3)
    await task(page + 1)
  }
}

retry(() => task(), {
  retries: 3,
})
