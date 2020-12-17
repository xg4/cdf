import dayjs from 'dayjs'
import House from '../models/house'

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

export function composeContent({
  region,
  name,
  details,
  number,
  phoneNumber,
  startsAt,
  endsAt,
  status,
}: House) {
  return [
    `${region} ${name} ${status}`,
    `
### 区域  \n${region}  \n
### 项目名称  \n${name}  \n
### 预售范围  \n${details}  \n
### 住房套数  \n${number}  \n
### 开发商咨询电话  \n${phoneNumber}  \n
### 登记开始时间：  \n${dayjs.unix(startsAt).format('YYYY-MM-DD hh:mm:ss')}  \n
### 登记结束时间：  \n${dayjs.unix(endsAt).format('YYYY-MM-DD hh:mm:ss')}  \n
### 状态：  \n${status}
`.trim(),
  ]
}

export function filterData([
  uuid,
  _,
  region,
  name,
  licenseNumber,
  details,
  number,
  phoneNumber,
  startsAt,
  endsAt,
  ___,
  status,
]: string[]) {
  return {
    uuid,
    region,
    name,
    licenseNumber,
    details,
    number,
    phoneNumber,
    startsAt: dayjs(startsAt).unix(),
    endsAt: dayjs(endsAt).unix(),
    status,
  }
}
