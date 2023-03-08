import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Answer } from './Answer';

@Entity()
export class QuestionPrompt {
  @PrimaryGeneratedColumn()
  promptId: QuestionId;

  @Column()
  question: string;

  @OneToMany(() => Answer, (answer) => answer.questionPrompt)
  answers: Relation<Answer>[];
}
