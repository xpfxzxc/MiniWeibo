import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import * as moment from 'moment';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  content: string;

  @Index()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @ManyToOne(type => User, user => user.statuses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  getCreatedAtForHumans(): string {
    moment.locale('zh-cn');
    return moment(this.createdAt).format('YYYY年MM月DD日HH点mm分ss秒');
  }

  getCreatedAtDiffForHumans(): string {
    moment.locale('zh-cn');
    return moment(this.createdAt).fromNow();
  }
}
