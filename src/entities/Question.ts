import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation, OneToOne } from 'typeorm';
import { User } from './User';
import { Answer } from './Answer';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  questionId: string;

  @Column()
  questionMood: string;

  @Column()
  questionText: string;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: ['insert', 'update'] })
  answer: Relation<Answer>[];

  @OneToOne(() => User, (user) => user.questions, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
