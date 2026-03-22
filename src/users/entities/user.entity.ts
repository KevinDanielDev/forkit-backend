import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  codeCountry: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken?: string | null;

  @BeforeInsert()
  prepareData() {
    this.email = this.email.toLowerCase().trim();
    this.phone = this.phone.trim();
    this.firstName = this.firstName.trim();
    this.lastName = this.lastName.trim();
    this.codeCountry = this.codeCountry.trim();
  }
}
