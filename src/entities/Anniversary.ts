import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Anniversary {
  @PrimaryGeneratedColumn('uuid')
  anniversaryId: string;

  @Column()
  datingAnniversary: number;

  @Column()
  weddingAnniversary: number;

  @Column()
  birthday: number;

  @Column()
  specialday: string;

  @Column()
  specialdate: number;

  @OneToOne(() => User, (user) => user.anniversary)
  @JoinColumn()
  user: Relation<User>;
}
