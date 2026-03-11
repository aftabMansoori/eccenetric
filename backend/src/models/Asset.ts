import { Table, Column, Model, DataType, PrimaryKey, Default, AllowNull } from 'sequelize-typescript';

export enum AssetStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
}

@Table({
  tableName: 'assets',
  timestamps: true,
})
export class Asset extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare originalName: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare storageKey: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare mimeType: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare sizeBytes: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare checksum?: string;

  @AllowNull(false)
  @Default(AssetStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(AssetStatus)))
  declare status: AssetStatus;
}
