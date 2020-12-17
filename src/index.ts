import Bot from '@xg4/dingtalk-bot'
import retry from 'async-retry'
import { SECRET, WEBHOOK } from './config'
import { initDB } from './db'
import House from './models/house'
import spider from './spider'
import { composeContent, filterData, sleep } from './util'

const bot = new Bot(WEBHOOK, SECRET)

let page = 1

async function task() {
  await initDB()

  const dataSource = await spider(page)

  const _diffList = await Promise.all(
    dataSource.map(filterData).map(async (item) => {
      const house = await House.findOne({
        where: {
          uuid: item.uuid,
        },
      })
      if (!house) {
        const _h = await House.create(item)
        console.log('creat ', item.name, item.status)
        return _h
      }
      if (house.status == item.status) {
        console.log('existed ', item.name, item.status)
        return
      }
      house.status = item.status
      await house.save()
      console.log('change ', item.name, item.status)
      return house
    })
  )

  const diffList = _diffList.filter(Boolean) as House[]

  await Promise.all(
    diffList.map((item) => {
      const [title, text] = composeContent(item)
      return bot.markdown({
        title,
        text,
      })
    })
  )

  if (diffList.length || page < 10) {
    page += 1
    console.log('Next ', page)
    await sleep(5 * 1e3)
    await task()
  }
}

retry(task, {
  retries: 3,
})
