import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('Houses')
class House extends BaseEntity {
  @PrimaryColumn()
  uuid!: string

  @Column()
  region!: string

  @Column()
  name!: string

  @Column()
  licenseNumber!: string

  @Column()
  details!: string

  @Column()
  number!: string

  @Column()
  phoneNumber!: string

  @Column()
  startsAt!: number

  @Column()
  endsAt!: number

  @Column()
  status!: string
}

export default House
