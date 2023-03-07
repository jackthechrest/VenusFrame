import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Partner } from './Partner';
import { Answer } from './Answer';
import { GameStatistics } from './GameStatistics';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ default: '' })
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

  @OneToOne(() => Partner, (partner) => partner.partnerOne)
  @JoinColumn({ name: 'partnerId' })
  partnerOne: Partner;

  @OneToOne(() => Partner, (partner) => partner.partnerTwo)
  @JoinColumn({ name: 'partnerId' })
  partnerTwo: Partner;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToOne(() => GameStatistics, (gameStats) => gameStats.user)
  gameStatistics: GameStatistics;
}
