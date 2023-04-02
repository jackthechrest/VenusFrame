import { Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class RulesOfLove {
  @PrimaryColumn()
  gameId: string;

  @OneToMany(() => User, (user) => user.rolInfo)
  players: Relation<User>[];
}
