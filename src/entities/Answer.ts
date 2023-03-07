import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { QuestionPrompt } from './QuestionPrompt';

@Entity()
export class Answer {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  promptId: string;

  @Column()
  answer: string;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @ManyToOne(() => QuestionPrompt, (prompt) => prompt.answers)
  questionPrompt: QuestionPrompt;
}
