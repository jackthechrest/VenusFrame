import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class Follow {
  // followId is targetedUsername + requestingUsername
  @PrimaryColumn()
  followId: string;

  @ManyToOne(() => User, (user) => user.following, { cascade: ['insert', 'update'] })
  targetedUser: Relation<User>;

  @ManyToOne(() => User, (user) => user.followers, { cascade: ['insert', 'update'] })
  requestingUser: Relation<User>;
}
