import { initDB } from './db'
import { HouseModel } from './models'
import { fetchHouses } from './spider'

async function bootstrap(page = 1) {
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
        // TODO: push new house
        const house = new HouseModel(item)
        await house.save()
      }
    })
  )

  db.disconnect()
}

bootstrap()
