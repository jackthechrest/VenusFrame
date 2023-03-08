import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class GameStatistics {
  @PrimaryGeneratedColumn('uuid')
  gameStatsId: string;

  @OneToOne(() => User, (user) => user.gameStatistics)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ default: 0 })
  bestTimeOurPet: number;

  @Column({ default: 0 })
  highestWinStreakRulesOfLove: number;

  @Column({ default: 0 })
  highestRoundReachedCopycat: number;
}
