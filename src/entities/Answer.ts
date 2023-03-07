<<<<<<< HEAD
import { Entity, Column, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { User } from './User';
=======
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c
import { QuestionPrompt } from './QuestionPrompt';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  userId: string;

  promptId: string;

  @Column()
  answer: string;

<<<<<<< HEAD
  @ManyToOne(() => User, (user) => user.answers)
  user: Relation<User>;

  @ManyToOne(() => QuestionPrompt, (prompt) => prompt.answers)
  questionPrompt: Relation<QuestionPrompt>;
=======
  @ManyToOne(() => QuestionPrompt)
  @JoinColumn()
  questionPrompt: QuestionPrompt;
>>>>>>> e33231a93a59234152e0c97290f0743195a93d2c
}
