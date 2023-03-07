<<<<<<< HEAD
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './User';
=======
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c

@Entity()
export class GameStatistics {
  @PrimaryGeneratedColumn()
  userId: string;

<<<<<<< HEAD
  @OneToOne(() => User, (user) => user.gameStatistics)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;
=======
  @Column({ default: 0 })
  bestTimeOurPet: number;
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c

  @Column({ default: 0 })
  highestWinStreakRulesOfLove: number;

  @Column({ default: 0 })
  highestRoundReachedCopycat: number;
}
