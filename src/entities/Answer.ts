import { Entity, Column, OneToOne, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answerId: string;

  @Column()
  answerMood: string;

  @Column()
  answerText: string;

  @OneToOne(() => User, (user) => user.answers, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @ManyToOne(() => Question, (question) => question.answer, { cascade: ['insert', 'update'] })
  question: Relation<Question>;
}
