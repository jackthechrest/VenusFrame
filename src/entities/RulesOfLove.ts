import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class RulesOfLove {
  @PrimaryColumn()
  gameId: string;

  @Column({ nullable: true })
  winnerName: string;

  @Column({ nullable: true })
  winnerChoice: RulesOfLoveOptions;

  @Column({ default: 0 })
  winnerStreak: number;

  @Column({ nullable: true })
  loserName: string;

  @Column({ nullable: true })
  loserChoice: RulesOfLoveOptions;

  @Column({ default: false })
  gameOver: boolean;

  @OneToMany(() => User, (user) => user.rolInfo, { cascade: ['insert', 'update'] })
  players: Relation<User>[];
}
