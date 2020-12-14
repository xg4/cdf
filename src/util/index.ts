export * from './file'

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

export function renderContent([
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
  return [
    `${region} ${name} ${status}`,
    `
### 区域  \n${region}  \n
### 项目名称  \n${name}  \n
### 预售范围  \n${details}  \n
### 住房套数  \n${number}  \n
### 开发商咨询电话  \n${phoneNumber}  \n
### 登记开始时间：  \n${startsAt}  \n
### 登记结束时间：  \n${endsAt}  \n
### 状态：  \n${status}
`.trim(),
  ]
}
