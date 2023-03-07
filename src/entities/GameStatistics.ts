import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class GameStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.gameStatistics)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 0 })
  bestTimeGame1: number;

  @Column({ default: 0 })
  highestWinStreakGame2: number;

  @Column({ default: 0 })
  highestRoundReachedGame3: number;
}
