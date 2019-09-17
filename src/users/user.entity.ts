import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import md5 = require('blueimp-md5');
import bcrypt = require('bcrypt');
import { Status } from '../statuses/status.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'is_admin',
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(type => Status, status => status.user)
  statuses: Status[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  gravatar(size: number = 100): string {
    const hash = md5(this.email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}
