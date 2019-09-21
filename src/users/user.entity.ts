import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToMany,
  JoinTable,
  ManyToMany,
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

  @Column({
    name: 'activation_token',
    nullable: true,
  })
  activationToken: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  activated: boolean;

  @OneToMany(type => Status, status => status.user)
  statuses: Status[];

  @ManyToMany(type => User, user => user.followings)
  @JoinTable({
    name: 'follower',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'follower_id', referencedColumnName: 'id' },
  })
  followers: User[];

  @ManyToMany(type => User, user => user.followers)
  followings: User[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
    this.activationToken = Math.random()
      .toString(36)
      .substr(2);
  }

  gravatar(size: number = 100): string {
    const hash = md5(this.email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}
