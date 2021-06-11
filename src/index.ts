import { House } from '@prisma/client'
import retry from 'async-retry'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import spider from './spider'
import { composeContent, diffHouses, filterData } from './util'

dayjs.extend(utc)
dayjs.extend(timezone)

let page = 1

async function task() {
  console.log('Page ', page)
  const dataSource = await spider(page)

  const _diffList = await Promise.all(
    dataSource.map(filterData).map(diffHouses)
  )

  const diffList = _diffList.filter(Boolean) as House[]

  await Promise.all(
    diffList.map((item) => {
      const [title, text] = composeContent(item)
      // TODO: push message
    })
  )

  if (diffList.length || page < 10) {
    page += 1
    console.log('Next ', page)
    await task()
  }
}

retry(task, {
  retries: 3,
})
