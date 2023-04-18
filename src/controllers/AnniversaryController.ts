import { Request, Response } from 'express';
import { addAnniversary, getAnniversaryById, getAnniversaries } from '../models/AnniversaryModel';

async function insertAnniversary(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { datingAnniversary, weddingAnniversary, birthday, specialday, specialdate } =
    req.body as NewAnniversaryRequest;

  const anniversaryInfo = await addAnniversary(
    datingAnniversary,
    weddingAnniversary,
    birthday,
    specialday,
    specialdate
  );

  res.render('anniversaryPage', { anniversaryInfo });
}

async function getAnniversary(req: Request, res: Response): Promise<void> {
  const { anniversaryId } = req.params as { anniversaryId: string };

  const anniversaryInfo = await getAnniversaryById(anniversaryId);

  if (!anniversaryInfo) {
    res.sendStatus(404);
    return;
  }

  res.render('anniversaryPage', { anniversaryInfo });
}

async function getAllAnniversary(req: Request, res: Response): Promise<void> {
  const anniversaries = await getAnniversaries();

  res.render('anniversaryPage', { anniversaries });
}

export { insertAnniversary, getAnniversary, getAllAnniversary };
