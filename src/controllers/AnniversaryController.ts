import { Request, Response } from 'express';
import {
  addAnniversary,
  getAnniversaryById,
  getAnniversaries,
  getAnniversaryByUserId,
} from '../models/AnniversaryModel';
import { getUserById } from '../models/UserModel';

async function insertAnniversary(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);

  if (!user) {
    res.redirect('/anniversaries');
    return;
  }

  const { datingAnniversary, weddingAnniversary, birthday, specialday, specialdate } =
    req.body as NewAnniversaryRequest;

  const anniversaryInfo = await addAnniversary(
    datingAnniversary,
    weddingAnniversary,
    birthday,
    specialday,
    specialdate,
    user
  );

  console.log(anniversaryInfo);
  res.render('anniversaryPage', { anniversaryInfo });
}

async function renderAnniversaryPage(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  const { userId } = req.params;

  if (!isLoggedIn) {
    res.redirect('/login');
  }

  const user = await getUserById(userId);
  const anniversaryInfo = await getAnniversaryByUserId(userId);

  if (!user || !anniversaryInfo) {
    res.redirect('/anniversaries');
    return;
  }

  console.log(anniversaryInfo);
  res.render('anniversaryPage', { anniversaryInfo });
}

async function getAllAnniversaries(req: Request, res: Response): Promise<void> {
  const anniversaries = await getAnniversaries();

  res.render('anniversaryPage', { anniversaries });
}

export { insertAnniversary, getAnniversaryById, renderAnniversaryPage, getAllAnniversaries };
