import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function spider(pageNo = 1) {
  const result = await fetch(
    `https://zw.cdzj.chengdu.gov.cn/lottery/accept/projectList?pageNo=${pageNo}`,
    {
      method: 'post',
    }
  ).then((res) => res.text())

  const $ = cheerio.load(result)

  const trList: string[][] = []
  $('#_projectInfo > tr').each((_, tr): void => {
    const tdList: string[] = []
    $(tr)
      .find('td')
      .each((_, td): void => {
        tdList.push($(td).text())
      })

    trList.push(tdList)
  })

  return trList
}
