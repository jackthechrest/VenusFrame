import { Request, Response } from 'express';
import { saveAnswer, getAllAnswers } from '../models/AnswerModel';
import { User } from '../entities/User';
import { parseDatabaseError } from '../utils/db-utils';
// TODO: function to give user a prompt to answer, call saveAnswer()
// (should the question be selected randomly or in some fixed order?)
// async function addUserAnswerToQuestion(req: Request, res: Response): Promise<void> {}

// TODO: function that will show user how their partner answered a question
// async function displayPartnerResponse(req: Request, res: Response): Promise<void> {}

async function getAnswer(req: Request, res: Response): Promise<void> {
  res.json(await getAllAnswers());
}

type NewAnswerRequest = {
  promptId: QuestionId;
  answer: string;
  user: User;
};

async function addNewAnswer(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { promptId, answer, user } = req.body as NewAnswerRequest;
  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
    const newAnswer = await saveAnswer(promptId, answer, user);
    console.log(newAnswer);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { getAnswer, addNewAnswer };
