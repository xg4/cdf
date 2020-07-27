import { Document, model, Schema } from 'mongoose'

export interface HouseDocument extends Document {
  /** id */
  uuid: string
  /** 区域 */
  region: string
  /** 项目名称 */
  project: string
  /** 预售证号 */
  license_number: string
  /** 预售范围 */
  range: string
  /** 住房套数 */
  quantity: string
  /** 开发商咨询电话 */
  phone: string
  /** 登记开始时间 */
  start: string
  /** 登记结束时间 */
  end: string
  /** 项目报名状态 */
  status: string

  created_at: number
  updated_at: number
}

const HouseSchema = new Schema<HouseDocument>({
  uuid: String,

  region: String,
  project: String,

  license_number: String,
  range: String,

  quantity: String,

  phone: String,
  start: String,
  end: String,
  status: String,

  created_at: {
    type: Number,
    default: Date.now,
  },

  updated_at: {
    type: Number,
    default: Date.now,
  },
})

HouseSchema.pre('save', function (this: HouseDocument, next) {
  this.updated_at = Date.now()
  next()
})

export const HouseModel = model<HouseDocument>('House', HouseSchema)
