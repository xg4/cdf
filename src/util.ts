import { F_OK } from 'constants'
import { format } from 'date-fns'
import { access } from 'fs/promises'
import { join } from 'path'

export function getFullPath(date: Date) {
  return join(__dirname, `../archives/${format(date, 'yyyy-MM-dd')}.txt`)
}

export function diffSource(source: string, trList: string[][]) {
  return trList
    .map((tdList) => {
      const str = tdList.join(' | ')
      return source.includes(str) ? null : tdList
    })
    .filter(Boolean) as string[][]
}

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

export async function exists(path: string) {
  try {
    await access(path, F_OK)
    return true
  } catch {
    return false
  }
}

export function renderContent([
  uuid,
  _,
  region,
  project,
  __,
  range,
  count,
  phone,
  startDate,
  endDate,
  ___,
  status,
]: string[]) {
  return `### 区域  \n ${region}  \n
  ### 项目名称  \n ${project}  \n
  ### 预售范围  \n ${range}  \n
  ### 住房套数  \n ${count}  \n
  ### 开发商咨询电话  \n ${phone}  \n
  ### 登记开始时间：  \n ${startDate}  \n
  ### 登记结束时间：  \n ${endDate}  \n
  ### 状态：  \n ${status}`
}
