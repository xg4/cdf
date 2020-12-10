import { F_OK } from 'constants'
import { access, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

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
