import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
