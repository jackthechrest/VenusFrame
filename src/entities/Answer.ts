import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User';
import { QuestionPrompt } from './QuestionPrompt';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  userId: string;

  promptId: string;

  @Column()
  answer: string;

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => QuestionPrompt)
  @JoinColumn()
  questionPrompt: QuestionPrompt;
}
