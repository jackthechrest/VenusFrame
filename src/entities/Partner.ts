import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from 'typeorm';

import { User } from './User';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  partnerId: string;

  @OneToOne(() => User, (user) => user.partnerOne)
  @JoinColumn()
  userOne: Relation<User>;

  @OneToOne(() => User, (user) => user.partnerTwo)
  @JoinColumn()
  userTwo: Relation<User>;

  @Column({ default: false })
  married: boolean;

  @Column()
  datingAnniversary: Date;

  @Column({ nullable: true })
  marriageAnniversary: Date;
}
