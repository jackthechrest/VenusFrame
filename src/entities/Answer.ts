import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answerId: string;

  @Column()
  answerText: string;

  @ManyToOne(() => User, (user) => user.answers, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @ManyToOne(() => Question, (question) => question.answer, { cascade: ['insert', 'update'] })
  question: Relation<Question>;
}
