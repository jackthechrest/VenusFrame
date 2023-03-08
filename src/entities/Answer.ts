import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './User';
import { QuestionPrompt } from './QuestionPrompt';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  userId: string;

  @PrimaryGeneratedColumn()
  promptId: string;

  @Column()
  answer: string;

  @ManyToOne(() => User, (user) => user.answers)
  user: Relation<User>;

  @ManyToOne(() => QuestionPrompt, (prompt) => prompt.answers)
  questionPrompt: Relation<QuestionPrompt>;
}
