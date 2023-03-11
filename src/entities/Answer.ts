import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  promptId: QuestionId;

  @Column()
  answer: string;

  @ManyToOne(() => User, (user) => user.answers)
  user: Relation<User>;
}
