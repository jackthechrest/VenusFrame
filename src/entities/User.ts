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
import { Partner } from './Partner';
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

  @Column({ default: true })
  isSingle: boolean;

  @OneToOne(() => Partner, (partner) => partner.userOne)
  @JoinColumn()
  partnerOne: Relation<Partner>;

  @OneToOne(() => Partner, (partner) => partner.userTwo)
  @JoinColumn()
  partnerTwo: Relation<Partner>;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Relation<Answer>[];

  // OurPet
  @Column({ default: 0 })
  bestTime: number;

  // Rules Of Love
  @ManyToOne(() => RulesOfLove, (rol) => rol.players)
  rolInfo: Relation<RulesOfLove>;

  @Column({ default: 'NONE' })
  currentPlay: RulesOfLoveOptions;

  @Column({ default: 0 })
  currentWinStreak: number;

  @Column({ default: 0 })
  highestWinStreak: number;

  // Copycat
  // make sure to check for when both players are 'creator' role at beginning of game
  @Column({ default: 'creator' })
  currentCopycatRole: CopycatRoles;

  @Column({ default: 0 })
  highestRoundReachedCopycat: number;

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];

  @OneToOne(() => Anniversary, (anniversary) => anniversary.user)
  @JoinColumn()
  anniversary: Relation<Anniversary>;
}
