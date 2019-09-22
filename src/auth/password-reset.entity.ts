import {
  Column,
  Index,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class PasswordReset {
  @PrimaryColumn()
  email: string;

  @Index()
  @Column()
  token: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.token = Math.random()
      .toString(36)
      .slice(2);
  }
}
