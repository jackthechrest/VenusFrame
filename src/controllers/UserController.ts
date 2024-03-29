import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import {
  addUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  incrementProfileViews,
  allUserData,
  resetAllProfileViews,
  updateEmailAddress,
  deleteUserById,
  deleteAllUsers,
  addPartnerToUserByTypeCode,
  typeCodeExists,
  deletePartnerByUserId,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { sendEmail } from '../services/emailService';
import { addReminder, deleteRemindersByUserId } from '../models/ReminderModel';
import { getTodayQuestion } from '../models/QuestionModel';
import { clearFollowsById, deleteAllFollows, getFollowById } from '../models/FollowModel';
import { removePlayerFromROL } from '../models/RulesOfLoveModel';
import { deleteAnniversaryById } from '../models/AnniversaryModel';
import { deleteAnswersByUserId } from '../models/AnswerModel';

async function getAllUserProfiles(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;
  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
    await addUser(username, email, passwordHash);
    await sendEmail(
      email,
      'Welcome!',
      `You have successfully created your account in Venus Frame!`
    );
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  // console.log(req.session);

  const now = new Date();
  // NOTES: We need to convert the date string back into a Date() object
  //        `parseISO()` does the conversion
  const logInTimeout = parseISO(req.session.logInTimeout);
  // NOTES: If the client has a timeout set and it has not expired
  if (logInTimeout && isBefore(now, logInTimeout)) {
    // NOTES: This will create a human friendly duration message
    const timeRemaining = formatDistanceToNow(logInTimeout);

    const message = `Log in Time out.You have ${timeRemaining} remaining.`;
    // NOTES: Reject their request
    res.status(429).send(message); // 429 Too Many Requests

    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  if (!user) {
    // req.flash('error', 'Email does not exist.');
    res.redirect('/login'); // 404 Not Found - email doesn't exist
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    // NOTES: If they haven't attempted to log in yet
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // NOTES: Set their attempts to one
    } else {
      req.session.logInAttempts += 1; // NOTES: Otherwise increment their attempts
    }

    // NOTES: If the client has failed five times then we will add a
    //        3 minute timeout
    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString(); // NOTES: Must convert to a string
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0; // NOTES: Reset their attempts
    }

    res.redirect('/login'); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    username: user.username,
  };
  req.session.isLoggedIn = true;
  res.redirect('/users/PreviewPage');
  // res.redirect(`/users/${user.userId}`);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // Get the user account
  let user = await getUserById(targetUserId);

  if (!user) {
    res.redirect('/login'); // 404 Not Found
    return;
  }

  // Now update their profile views
  user = await incrementProfileViews(user);

  const { isLoggedIn, authenticatedUser } = req.session;
  const viewingUser = await getUserById(authenticatedUser.userId);
  const targetFollow = await getFollowById(user.userId + viewingUser.userId);

  res.render('ProfilePage', {
    user,
    authenticatedId: viewingUser.userId,
    loggedIn: isLoggedIn,
    following: targetFollow,
  });
}

async function findUser(req: Request, res: Response): Promise<void> {
  const { username } = req.body;

  const user = await getUserByUsername(username);

  if (!user) {
    res.redirect('/search');
    return;
  }

  res.redirect(`/users/${user.userId}`);
}

async function resetProfileViews(req: Request, res: Response): Promise<void> {
  await resetAllProfileViews();
  res.sendStatus(200);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn || authenticatedUser.userId !== targetUserId) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  const { email } = req.body as { email: string };

  // Get the user account
  const user = await getUserById(targetUserId);

  if (!user) {
    res.redirect('/login'); // 404 Not Found
    return;
  }

  // Now update their email address
  try {
    await updateEmailAddress(targetUserId, email);
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function deleteAccount(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  const { email, password } = req.body as AuthRequest;

  if (!isLoggedIn) {
    res.redirect('/login'); // not logged in
    return;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    res.redirect('/users/PreviewPage'); // 404 Not Found - email doesn't exist
    return;
  }

  if (authenticatedUser.userId !== user.userId) {
    res.redirect('/users/PreviewPage'); // trying to delete someone elses account
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.redirect('/users/PreviewPage'); // 404 not found - user w/ email/password doesn't exist
  }

  if (user.rolInfo) {
    await removePlayerFromROL(user.rolInfo.gameId, user);
  }

  if (user.partner) {
    await deletePartnerByUserId(user.partner.userId);
    await deletePartnerByUserId(user.userId);
  }

  if (user.anniversary) {
    await deleteAnniversaryById(user.anniversary.anniversaryId);
  }

  await deleteRemindersByUserId(user.userId);
  await deleteAnswersByUserId(user.userId);

  await clearFollowsById(user.userId);
  await deleteUserById(user.userId);
  res.redirect('/index');
}

async function deleteAllAccounts(req: Request, res: Response): Promise<void> {
  await deleteAllFollows();
  await deleteAllUsers();
  res.redirect('/index');
}

async function createReminder(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);

  const { sendNotificationOn, items } = req.body as CreateReminderBody;
  await addReminder(sendNotificationOn, items, user);

  res.sendStatus(201);
}

async function renderPreviewPage(req: Request, res: Response): Promise<void> {
  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);

  res.render('PreviewPage', { user });
}

async function renderConnectPage(req: Request, res: Response): Promise<void> {
  const { authenticatedUser } = req.session;
  console.log('render connect page');
  const user = await getUserById(authenticatedUser.userId);

  res.render('FindPartnerId', { user });
}

async function renderQuestionPage(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;
  const user = await getUserById(targetUserId);
  const question = await getTodayQuestion();

  res.render('QuestionPage', { user, question });
}

async function handleFindPartner(req: Request, res: Response): Promise<void> {
  const { authenticatedUser } = req.session;
  const { partnerTypeCode } = req.body;

  const user = await addPartnerToUserByTypeCode(authenticatedUser.userId, partnerTypeCode);

  if (!user) {
    res.redirect('/login');
  }

  res.redirect(`/users/${user.partner.userId}`);
}

async function insertTypeCode(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const { typeCode } = req.body as TypeCode;
  if (!(await typeCodeExists(typeCode))) {
    // res.render('FindPartnerId', { typeCode });
    res.redirect(`/users/FindPartnerId`);
    return;
  }

  await addPartnerToUserByTypeCode(authenticatedUser.userId, typeCode);
  const user = await getUserById(authenticatedUser.userId);

  res.redirect(`/users/${user.userId}`);
}

export {
  registerUser,
  logIn,
  getUserProfileData,
  getAllUserProfiles,
  findUser,
  resetProfileViews,
  updateUserEmail,
  deleteAccount,
  deleteAllAccounts,
  createReminder,
  renderPreviewPage,
  renderConnectPage,
  renderQuestionPage,
  handleFindPartner,
  insertTypeCode,
};
