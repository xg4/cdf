import puppeteer from 'puppeteer-core'
import { TARGET_URL } from './config'

export async function fetchHouses() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(`${TARGET_URL}/index`)
  await page.goto(`${TARGET_URL}/projectList`)

  const content = await page.$eval('#_projectInfo', (tableEl) => {
    return Array.from(tableEl.querySelectorAll('tr')).map((trEl) => {
      const tdEls = Array.from(trEl.querySelectorAll('td'))
      return {
        uuid: tdEls[0].textContent as string,
        region: tdEls[2].textContent as string,
        project: tdEls[3].textContent as string,
        license_number: tdEls[4].textContent as string,
        range: tdEls[5].textContent as string,
        quantity: tdEls[6].textContent as string,
        phone: tdEls[7].textContent as string,
        start: tdEls[8].textContent as string,
        end: tdEls[9].textContent as string,
        status: tdEls[11].textContent as string,
      }
    })
  })

  await browser.close()

  return content
}
