import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class GameStatistics {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column({ default: 0 })
  bestTimeOurPet: number;

  @Column({ default: 0 })
  highestWinStreakRulesOfLove: number;

  @Column({ default: 0 })
  highestRoundReachedCopycat: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
}
