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

  @OneToOne((type) => User, (user) => user.userId)
  @JoinColumn()
  user1Id: User['userId'];

  @OneToOne((type) => User, (user) => user.userId)
  @JoinColumn()
  user2Id: User['userId'];
}
