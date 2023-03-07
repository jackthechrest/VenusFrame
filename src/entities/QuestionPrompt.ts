<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
=======
import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c
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
