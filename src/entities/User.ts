import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Answer } from './Answer';
import { RulesOfLove } from './RulesOfLove';
import { Reminder } from './Reminder';
import { Anniversary } from './Anniversary';
import { Follow } from './Follow';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @Column({ unique: true })
  typeCode: string;

  @OneToOne(() => User, (user) => user.partner)
  @JoinColumn()
  partner: Relation<User>;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Relation<Answer>[];

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];

  @OneToOne(() => Anniversary, (anniversary) => anniversary.user)
  @JoinColumn()
  anniversary: Relation<Anniversary>;

  // follow
  @OneToMany(() => Follow, (follow) => follow.requestingUser, { cascade: ['insert', 'update'] })
  following: Relation<Follow>[];

  @OneToMany(() => Follow, (follow) => follow.targetedUser, { cascade: ['insert', 'update'] })
  followers: Relation<Follow>[];

  // Rules Of Love
  @ManyToOne(() => RulesOfLove, (rol) => rol.players, { cascade: ['insert', 'update'] })
  rolInfo: Relation<RulesOfLove>;

  @Column({ default: 'NONE' })
  currentPlay: RulesOfLoveOptions;

  @Column({ default: 0 })
  currentWinStreak: number;

  @Column({ default: 0 })
  highestWinStreak: number;

  @Column({ default: false })
  inGame: boolean;
}
