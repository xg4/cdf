export * from './file'

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

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
