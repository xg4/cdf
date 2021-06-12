import { House } from '@prisma/client'
import dayjs from 'dayjs'
import { prisma } from './prisma'
import { pull } from './spider'

const debug = require('debug')('db:house')

export async function task(page = 1) {
  const houses = await pull(page)

  const _diffList = await Promise.all(
    houses.map(async (house) => {
      const savedHouse = await prisma.house.findUnique({
        where: { uuid: house.uuid },
      })
      if (!savedHouse) {
        debug(`creat ${house.name} ${house.status}`)
        return prisma.house.create({
          data: house,
        })
      }

      if (savedHouse.hash !== house.hash) {
        debug(`change ${house.name} ${house.status}`)
        return prisma.house.update({
          where: { uuid: house.uuid },
          data: house,
        })
      }
    })
  )

  const diffList = _diffList.filter(Boolean) as House[]

  await pushHouses(diffList)

  const isContinue = houses.every(
    (h) => dayjs().diff(h.startedAt, 'month') <= 0
  )

  if (isContinue) {
    await task(page + 1)
  }
}

async function pushHouses(houses: House[]) {
  await Promise.all(
    houses.map((item) => {
      const [title, text] = composeContent(item)
    })
  )
}

function composeContent({
  region,
  name,
  details,
  quantity,
  startedAt,
  finishedAt,
  status,
}: House) {
  return [
    `${region} ${name} ${status}`,
    `
### 区域  \n${region}  \n
### 项目名称  \n${name}  \n
### 预售范围  \n${details}  \n
### 住房套数  \n${quantity}  \n
### 登记开始时间：  \n${dayjs(startedAt).format('YYYY-MM-DD HH:mm:ss')}  \n
### 登记结束时间：  \n${dayjs(finishedAt).format('YYYY-MM-DD HH:mm:ss')}  \n
### 状态：  \n${status}
`.trim(),
  ]
}
