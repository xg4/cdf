import { initDB } from './db'
import { HouseModel, HouseDocument } from './models'
import { fetchHouses } from './spider'
import Bot from '@xg4/dingtalk-bot'
import { WEBHOOK, SECRET } from './config'

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

async function bootstrap(page = 12) {
  const db = await initDB()

  const list = await fetchHouses(page)

  const dbList = await Promise.all(
    list.map((item) => HouseModel.findOne({ uuid: item.uuid }))
  )
  const shouldTurnPage = dbList.every((item) => !item)
  if (shouldTurnPage) {
    setTimeout(() => {
      bootstrap(page + 1)
    }, 60 * 1e3)
  }

  await Promise.all(
    list.map(async (item) => {
      const savedHouse = await HouseModel.findOne({
        uuid: item.uuid,
      })
      if (savedHouse) {
        if (savedHouse.status !== item.status) {
          savedHouse.status = item.status
          // TODO: push status
          await savedHouse.save()
        }
      } else {
        const house = new HouseModel(item)
        await house.save()
        await bot.markdown({
          title: `新房源 - ${house.project}`,
          text: renderContent(house),
        })
      }
    })
  )

  db.disconnect()
}

bootstrap()
