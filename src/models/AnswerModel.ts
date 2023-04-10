import { AppDataSource } from '../dataSource';
import { Answer } from '../entities/Answer';
import { User } from '../entities/User';
import { Question } from '../entities/Question';

const answerRepository = AppDataSource.getRepository(Answer);

// // questionIDs on the left each match up to a question body on the right
// const questions: QuestionData = {
//   PlaceholderID1: 'Placeholder Question 1',
//   PlaceholderID2: 'Placeholder Question 2',
// };

// retrieve a question body by its id
async function getAnswerById(answerId: string): Promise<Answer | null> {
  return await answerRepository.findOne({ where: { answerId } });
}

// save a user's answer to a given question
async function saveAnswer(
  answerMood: string,
  answerText: string,
  byUser: User,
  forQuestion: Question
): Promise<Answer> {
  let newAnswer = new Answer();
  newAnswer.answerMood = answerMood;
  newAnswer.answerText = answerText;
  newAnswer.user = byUser;
  newAnswer.question = forQuestion;

  newAnswer = await answerRepository.save(newAnswer);

  return newAnswer;
}

async function getAllAnswers(): Promise<Answer[]> {
  return answerRepository.find();
}

async function userHasAnswerForQuestion(userId: string, questionId: string): Promise<boolean> {
  const answerExists = await answerRepository
    .createQueryBuilder('answer')
    .leftJoinAndSelect('answer.user', 'user')
    .leftJoinAndSelect('answer.question', 'question')
    .where('user.userId = :userId', { userId })
    .andWhere('question.questionId = :questionId', { questionId })
    .getExists();

  return answerExists;
}

async function answerBelongsToUser(answerId: string, userId: string): Promise<boolean> {
  const answerExists = await answerRepository
    .createQueryBuilder('answer')
    .leftJoinAndSelect('answer.user', 'user')
    .where('answer.answerId = :answerId', { answerId })
    .andWhere('user.userId = :userId', { userId })
    .getExists();

  return answerExists;
}

async function deleteAnswerById(answerId: string): Promise<void> {
  await answerRepository
    .createQueryBuilder('answer')
    .delete()
    .where('answerId = :answerId', { answerId })
    .execute();
}

export {
  getAnswerById,
  saveAnswer,
  getAllAnswers,
  userHasAnswerForQuestion,
  answerBelongsToUser,
  deleteAnswerById,
};
