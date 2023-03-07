import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, Column } from 'typeorm';
import { Couple } from './Couple';
import { Answer } from './Answer';
import { GameStatistics } from './GameStatistics';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: true })
  coupleId: string;

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

  @OneToOne(() => Couple, (couple) => couple.partnerOne)
  @JoinColumn({ name: 'partnerId' })
  partnerOne: Couple;

  @OneToOne(() => Couple, (couple) => couple.partnerTwo)
  @JoinColumn({ name: 'partnerId' })
  partnerTwo: Couple;

  @OneToMany(() => Answer, (answer) => answer)
  answers: Answer[];

  @OneToOne(() => GameStatistics, (gameStats) => gameStats)
  gameStatistics: GameStatistics;
}
