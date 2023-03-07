import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from 'typeorm';

import { User } from './User';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  partnerId: string;

  @Column()
  partnerOneId: string;

  @OneToOne(() => User, (user) => user.partnerOne)
  @JoinColumn({ name: 'partnerOneId' })
  partnerOne: Relation<User>;

  @Column()
  partnerTwoId: string;

  @OneToOne(() => User, (user) => user.partnerTwo)
  @JoinColumn({ name: 'partnerTwoId' })
  partnerTwo: Relation<User>;

  @Column({ default: false })
  married: boolean;

  @Column()
  datingAnniversary: number;

  @Column()
  marriageAnniversary: number;
}
