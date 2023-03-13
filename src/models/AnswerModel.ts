import { AppDataSource } from '../dataSource';
import { Answer } from '../entities/Answer';
import { User } from '../entities/User';

const answerRepository = AppDataSource.getRepository(Answer);

// questionIDs on the left each match up to a question body on the right
const questions: QuestionData = {
  PlaceholderID1: 'Placeholder Question 1',
  PlaceholderID2: 'Placeholder Question 2',
};

// retrieve a question body by its id
function getQuestionById(questionId: QuestionId): string | undefined {
  return questions[questionId];
}

// save a user's answer to a given question
async function saveAnswer(promptId: QuestionId, answer: string, user: User): Promise<Answer> {
  let newAnswer = new Answer();
  newAnswer.promptId = promptId;
  newAnswer.answer = answer;
  newAnswer.user = user;

  newAnswer = await answerRepository.save(newAnswer);

  return newAnswer;
}

export { getQuestionById, saveAnswer };
