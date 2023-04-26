import { Request, Response } from 'express';
import { addQuestion, getQuestionById } from '../models/QuestionModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getQuestion(req: Request, res: Response): Promise<void> {
  const { questionId } = req.params as { questionId: string };

  const question = await getQuestionById(questionId);

  if (!question) {
    res.redirect('/preview');
    return;
  }

  res.render('dailyquestion', { question });
}

async function addNewQuestion(req: Request, res: Response): Promise<void> {
  // const { questionId } = req.params as { questionId: string };
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login'); // 401 Unauthorized
    return;
  }
  const { questionText } = req.body as { questionText: string };

  try {
    const question = await addQuestion(questionText);
    console.log(question);

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
  res.render(`dailyquestion`, { questionText });
}

export { getQuestion, addNewQuestion };
