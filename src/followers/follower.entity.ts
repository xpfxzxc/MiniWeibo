import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('follower', { schema: 'miniweibo' })
@Index('IDX_6a78a9c6f866dcc0b9195a5420', ['user'])
@Index('IDX_c39c716bcdda7f17adcfe4643a', ['follower'])
export class Follower {
  @ManyToOne(() => User, (user: User) => user.followings, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user: User) => user.followers, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: User;
}
