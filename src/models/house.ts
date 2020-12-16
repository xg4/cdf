import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db'

class House extends Model {
  public uuid!: string
  public region!: string
  public name!: string

  public licenseNumber!: string
  public details!: string
  public number!: string
  public phoneNumber!: string
  public startsAt!: number
  public endsAt!: number
  public status!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

House.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    region: DataTypes.TEXT,
    name: DataTypes.TEXT,
    licenseNumber: DataTypes.TEXT,
    details: DataTypes.TEXT,
    number: DataTypes.TEXT,
    phoneNumber: DataTypes.TEXT,
    startsAt: DataTypes.INTEGER,
    endsAt: DataTypes.INTEGER,
    status: DataTypes.TEXT,
  },
  {
    sequelize,
    timestamps: false,
  }
)

export default House
