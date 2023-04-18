import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import {
  addUser,
  getUserByEmail,
  getUserById,
  incrementProfileViews,
  allUserData,
  resetAllProfileViews,
  updateEmailAddress,
  deleteUserById,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { sendEmail } from '../services/emailService';
import { addReminder } from '../models/ReminderModel';

async function getAllUserProfiles(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;
  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
    const newUser = await addUser(username, email, passwordHash);
    console.log(newUser);

    await sendEmail(email, 'Welcome!', `Thank you for joining my application!`);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

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
  res.redirect('/preview');
  // res.redirect(`/users/${user.userId}`);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // Get the user account
  let user = await getUserById(targetUserId);

  if (!user) {
    res.redirect('/preview'); // 404 Not Found
    return;
  }

  // Now update their profile views
  user = await incrementProfileViews(user);

  // res.json(user);
  res.render('ProfilePage', {
    username: user.username,
    profileViews: user.profileViews,
    typeCode: user.typeCode,
  });
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
    res.redirect('/chat'); // 404 Not Found - email doesn't exist
    return;
  }

  if (authenticatedUser.userId !== user.userId) {
    res.redirect('/chat'); // trying to delete someone elses account
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.redirect('/chat'); // 404 not found - user w/ email/password doesn't exist
  }

  deleteUserById(user.userId);
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
export {
  registerUser,
  logIn,
  getUserProfileData,
  getAllUserProfiles,
  resetProfileViews,
  updateUserEmail,
  deleteAccount,
  createReminder,
};
