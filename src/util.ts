import { F_OK } from 'constants'
import { access, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export function getFullPath(filename: string) {
  return join(__dirname, `../archives/${filename}.txt`)
}

export function diffContent(source: string, trList: string[][]) {
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

async function getFileContent(fullPath: string) {
  let source = ''
  if (await exists(fullPath)) {
    const fileText = await readFile(fullPath)
    const decoder = new TextDecoder()
    source = decoder.decode(fileText)
  }
  return source
}

export async function diffFile(fullPath: string, trList: string[][]) {
  const source = await getFileContent(fullPath)
  const diffList = diffContent(source, trList)

  if (diffList.length) {
    const diffStr = diffList.map((td) => td.join(' | ')).join('\n')
    const newSource = source ? diffStr + '\n' + source : diffStr
    await writeFile(fullPath, newSource)
  }

  return diffList
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
  return [
    `${project} ${status}`,
    `### 区域  \n ${region}  \n
    ### 项目名称  \n ${project}  \n
    ### 预售范围  \n ${range}  \n
    ### 住房套数  \n ${count}  \n
    ### 开发商咨询电话  \n ${phone}  \n
    ### 登记开始时间：  \n ${startDate}  \n
    ### 登记结束时间：  \n ${endDate}  \n
    ### 状态：  \n ${status}`,
  ]
}
