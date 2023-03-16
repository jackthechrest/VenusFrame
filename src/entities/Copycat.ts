import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Copycat {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column()
  puzzleToMatch: string;

  @Column({ default: 5 })
  livesLeft: number;

  @Column({ default: 0 })
  currentRoundsPassed: number;
}
