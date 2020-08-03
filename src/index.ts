import Bot from '@xg4/dingtalk-bot'
import { SECRET, WEBHOOK } from './config'
import { initDB } from './db'
import { HouseDocument, HouseModel } from './models'
import { fetchHouses } from './spider'

const bot = new Bot(WEBHOOK, SECRET)

function renderContent(house: HouseDocument) {
  return `
  ### 区域  \n ${house.region}  \n
  ### 项目名称  \n ${house.project}  \n
  ### 预售范围  \n ${house.range}  \n
  ### 住房套数  \n ${house.quantity}  \n
  ### 开发商咨询电话  \n ${house.phone}  \n
  ### 登记开始时间：  \n ${house.start}  \n
  ### 登记结束时间：  \n ${house.end}  \n
  ### 状态：  \n ${house.status}`
}

async function bootstrap(page = 1) {
  const db = await initDB()

  console.log(page)
  const list = await fetchHouses(page)
  console.log(list.map((item) => item.project).join(','))

  const statusList = await Promise.all(
    list.map(async (item) => {
      const savedHouse = await HouseModel.findOne({
        uuid: item.uuid,
      })
      if (savedHouse) {
        if (savedHouse.status !== item.status) {
          savedHouse.status = item.status
          await savedHouse.save()
          await bot.markdown({
            title: `${savedHouse.status} - ${savedHouse.project}`,
            text: renderContent(savedHouse),
          })
          return false
        }
        return true
      } else {
        const house = new HouseModel(item)
        await house.save()
        await bot.markdown({
          title: `新房源 - ${house.project}`,
          text: renderContent(house),
        })

        return false
      }
    })
  )

  const shouldTurnPage = statusList.every((s) => !s)
  if (shouldTurnPage) {
    setTimeout(() => {
      bootstrap(page + 1)
    }, 60 * 1e3)
  }

  db.disconnect()
}

bootstrap().catch((err: Error) => {
  console.error(err)
  if (err.message.includes('Navigation timeout')) {
    process.exit()
  } else {
    process.exit(1)
  }
})
