import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class Follow {
  // followId is targetedUserId + requestingUserId
  @PrimaryColumn()
  followId: string;

  @Column({ default: 'NONE' })
  targetUserId: string;

  @Column({ default: 'NONE' })
  targetUsername: string;

  @ManyToOne(() => User, (user) => user.followers, { cascade: ['insert', 'update'] })
  targetedUser: Relation<User>;

  @Column({ default: 'NONE' })
  requestUserId: string;

  @Column({ default: 'NONE' })
  requestUsername: string;

  @ManyToOne(() => User, (user) => user.following, { cascade: ['insert', 'update'] })
  requestingUser: Relation<User>;
}
