import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
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
}
