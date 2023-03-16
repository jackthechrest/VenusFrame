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
import { GameStatistics } from './GameStatistics';
import { RulesOfLove } from './RulesOfLove';

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

  @OneToOne(() => GameStatistics, (gameStats) => gameStats.user)
  gameStatistics: Relation<GameStatistics>;

  // Rules Of Love
  @ManyToOne(() => RulesOfLove, (rol) => rol.players)
  rolInfo: Relation<RulesOfLove>;

  @Column({ default: 'NONE' })
  currentPlay: RulesOfLoveOptions;

  @Column({ default: 0 })
  currentWinStreak: number;

  // Copycat
  // make sure to check for when both players are 'creator' role at beginning of game
  @Column({ default: 'creator' })
  currentCopycatRole: CopycatRoles;
}
