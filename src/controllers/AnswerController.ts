import { Request, Response } from 'express';
import {
  addAnswer,
  getAnswerById,
  userHasAnswerForQuestion,
  answerBelongsToUser,
  deleteAnswerById,
} from '../models/AnswerModel';
import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';
import { getQuestionById } from '../models/QuestionModel';
// TODO: function that will show user how their partner answered a question
// async function displayPartnerResponse(req: Request, res: Response): Promise<void> {}

async function getAnswers(req: Request, res: Response): Promise<void> {
  const { answerId } = req.params as { answerId: string };

  const answer = await getAnswerById(answerId);

  if (!answer) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(answer);
}

async function addNewAnswer(req: Request, res: Response): Promise<void> {
  const { questionId } = req.params as { questionId: string };
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { answerMood, answerText } = req.body as NewAnswerRequest;
  const user = await getUserById(authenticatedUser.userId);
  const question = await getQuestionById(questionId);
  if (!question || !user) {
    res.sendStatus(404);
    return;
  }

  const answerExists = await userHasAnswerForQuestion(authenticatedUser.userId, questionId);
  if (answerExists) {
    res.sendStatus(409); // 409 Conflict
    return;
  }

  try {
    const answer = await addAnswer(answerMood, answerText, user, question);
    console.log(answer);
    answer.user = undefined;

    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
  res.redirect(`/questions/${questionId}`);
}

async function addAnswerForQuestion(req: Request, res: Response): Promise<void> {
  res.sendStatus(501);
}

async function deleteUserAnswer(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { answerId } = req.params as AnswerIdParam;

  const answerExists = await answerBelongsToUser(answerId, authenticatedUser.userId);
  if (!answerExists) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  await deleteAnswerById(answerId);
  res.sendStatus(204); // 204 No Content
}

async function renderquestionPage(req: Request, res: Response): Promise<void> {
  const { questionId } = req.params as QuestionIdParam;
  const question = await getQuestionById(questionId);

  res.render('dailyquestion', { question });
}
export { getAnswers, addNewAnswer, addAnswerForQuestion, deleteUserAnswer, renderquestionPage };
