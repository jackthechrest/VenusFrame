import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class QuestionPrompt {
  @PrimaryGeneratedColumn()
  promptId: QuestionId;

  @Column()
  question: string;
}
