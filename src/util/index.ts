import { House, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { md5 } from './md5'

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

export function composeContent({
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

export function filterData(data: string[]) {
  const [
    uuid,
    _,
    region,
    name,
    ______,
    details,
    quantity,
    __,
    startedAt,
    finishedAt,
    ___,
    ____,
    _____,
    status,
  ] = data
  const hash = md5(data.join())
  return {
    uuid,
    region,
    name,
    details,
    quantity: Number(quantity),
    startedAt: dayjs.tz(startedAt, 'Asia/Shanghai').toDate(),
    finishedAt: dayjs.tz(finishedAt, 'Asia/Shanghai').toDate(),
    status,
    hash,
  }
}

export async function diffHouses(house: House) {
  const prisma = new PrismaClient()
  const savedHouse = await prisma.house.findUnique({
    where: { uuid: house.uuid },
  })
  if (!savedHouse) {
    console.log('creat ', house.name, house.status)
    return prisma.house.create({
      data: house,
    })
  }

  if (savedHouse.hash !== house.hash) {
    console.log('change ', house.name, house.status)
    return prisma.house.update({
      where: { uuid: house.uuid },
      data: house,
    })
  }
}
