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

  @Column({ unique: true, nullable: true })
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
