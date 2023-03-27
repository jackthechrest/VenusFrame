import { Entity, Column, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class RulesOfLove {
  @PrimaryColumn()
  gameId: string;

  @Column({ default: 0 })
  numOfPlayers: number;

  @OneToMany(() => User, (user) => user.rolInfo)
  players: Relation<User>[];
}
