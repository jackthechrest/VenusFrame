import { Request, Response } from 'express';
import { getAllQuestions, addQuesetion } from '../models/QuestionModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getQuestion(req: Request, res: Response): Promise<void> {
  res.json(await getAllQuestions());
}

async function addNewQuestion(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }
  const { questionMood, questionText } = req.body as NewQuestionRequest;

  try {
    // Attempt to add the book
    const question = await addQuesetion(questionMood, questionText);
    console.log(question);

    res.status(201).json(question);
  } catch (err) {
    // It failed for some reason so we respond with an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { getQuestion, addNewQuestion };
