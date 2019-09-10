import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import md5 = require('blueimp-md5');

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

  gravatar(size: number = 100): string {
    const hash = md5(this.email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}
