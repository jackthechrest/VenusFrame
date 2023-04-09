import { AppDataSource } from '../dataSource';
import { Question } from '../entities/Question';

const questionRepository = AppDataSource.getRepository(Question);

async function addQuesetion(questionMood: string, questionText: string): Promise<Question> {
  let newQuestion = new Question();
  newQuestion.questionMood = questionMood;
  newQuestion.questionText = questionText;

  newQuestion = await questionRepository.save(newQuestion);
  return newQuestion;
}

async function getQuestionById(questionId: string): Promise<Question | null> {
  return await questionRepository.findOne({ where: { questionId } });
}

async function getAllQuestions(): Promise<Question[]> {
  return await questionRepository.find();
}

export { addQuesetion, getQuestionById, getAllQuestions };
