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

  // res.status(200).json(book);
  res.render('dailyquestion', { question });
}

async function addNewQuestion(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login'); // 401 Unauthorized
    return;
  }
  const { questionMood, questionText } = req.body as NewQuestionRequest;

  try {
    // Attempt to add the book
    const question = await addQuestion(questionMood, questionText);
    console.log(question);

    res.status(201).json(question);
  } catch (err) {
    // It failed for some reason so we respond with an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
  res.render(`dailyquestion`, { questionMood, questionText });
}

export { getQuestion, addNewQuestion };
