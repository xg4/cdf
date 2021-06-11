import cheerio from 'cheerio'
import dayjs from 'dayjs'
import fetch from 'node-fetch'
import { md5 } from './md5'

const debug = require('debug')('lib:spider')

export async function pull(pageNo: number) {
  debug(`page ${pageNo}`)
  const result = await fetch(
    `https://zw.cdzj.chengdu.gov.cn/lottery/accept/projectList?pageNo=${pageNo}`,
    {
      method: 'post',
    }
  ).then((res) => res.text())

  const $ = cheerio.load(result)

  const trList: string[][] = []
  $('#_projectInfo > tr').each((_, tr) => {
    const tdList: string[] = []
    $(tr)
      .find('td')
      .each((_, td) => {
        tdList.push($(td).text())
      })

    trList.push(tdList)
  })

  // 数据异常
  if (trList[0] && trList[0][14] !== '查看') {
    debug('Invalid data')
    throw new Error('Invalid data')
  }

  return trList.map(filterData)
}

function filterData(data: string[]) {
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
