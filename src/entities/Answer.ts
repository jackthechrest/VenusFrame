import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { QuestionPrompt } from './QuestionPrompt';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  userId: string;

  promptId: string;

  @Column()
  answer: string;

  @ManyToOne(() => QuestionPrompt)
  @JoinColumn()
  questionPrompt: QuestionPrompt;
}
