<<<<<<< HEAD
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { Partner } from './Partner';
=======
import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, Column } from 'typeorm';
import { Couple } from './Couple';
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c
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
<<<<<<< HEAD
  partnerOne: Relation<Partner>;
=======
  partnerOne: Couple;
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c

  @OneToOne(() => Couple, (couple) => couple.partnerTwo)
  @JoinColumn({ name: 'partnerId' })
<<<<<<< HEAD
  partnerTwo: Relation<Partner>;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Relation<Answer>[];

  @OneToOne(() => GameStatistics, (gameStats) => gameStats.user)
  gameStatistics: Relation<GameStatistics>;
=======
  partnerTwo: Couple;

  @OneToMany(() => Answer, (answer) => answer)
  answers: Answer[];

  @OneToOne(() => GameStatistics, (gameStats) => gameStats)
  gameStatistics: GameStatistics;
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c
}
