import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Anniversary {
  @PrimaryGeneratedColumn('uuid')
  anniversaryId: string;

  @Column()
  datingAnniversary: number;

  @Column()
  birthday: number;

  @Column({ nullable: true })
  weddingAnniversary: number;

  @Column({ nullable: true })
  specialday: string;

  @Column({ nullable: true })
  specialdate: number;

  @OneToOne(() => User, (user) => user.anniversary, { cascade: ['insert', 'update'] })
  @JoinColumn()
  user: Relation<User>;
}
