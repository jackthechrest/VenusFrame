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
  console.log(anniversaryInfo);
  res.render('anniversaryPage', { anniversaryInfo });
}

async function getAnniversaryProfileData(req: Request, res: Response): Promise<void> {
  const { targetAnniversaryId } = req.params as AnniversaryIdParam;

  const anniversaryInfo = await getAnniversaryById(targetAnniversaryId);

  if (!anniversaryInfo) {
    res.redirect('/login');
    return;
  }
  console.log(anniversaryInfo);
  res.render('anniversaryPage', { anniversaryInfo });
}

async function getAllAnniversaries(req: Request, res: Response): Promise<void> {
  const anniversaries = await getAnniversaries();

  res.render('anniversaryPage', { anniversaries });
}

export { insertAnniversary, getAnniversaryProfileData, getAllAnniversaries };
