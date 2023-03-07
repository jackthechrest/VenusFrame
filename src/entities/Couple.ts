import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User';

@Entity()
export class Couple {
  @PrimaryGeneratedColumn('uuid')
  coupleId: string;

  @Column({ default: false })
  married: boolean;

  @Column()
  datingAnniversary: Date;

  @Column({ nullable: true })
  marriageAnniversary: Date;

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn()
  partnerOne: User['userId'];

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn()
  partnerTwo: User['userId'];
}
