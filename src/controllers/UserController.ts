import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  incrementProfileViews,
  getUserById,
  updateEmailAddress,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;

  // hash user's password
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(username, email, passwordHash);
    console.log(`\nAdded new user: `);
    console.log(newUser);
    res.sendStatus(201); // 201 Created
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as NewUserRequest;
  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 not found - email doesn't exist
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 not found - user w/ email/password doesn't exist
    return;
  }

  console.log(`${user.username} logged in`);
  res.sendStatus(200);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  // Get the user account
  let user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  // Now update their profile views
  user = await incrementProfileViews(user);
  res.json(user); // Send back the user's data
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const { email } = req.body;

  try {
    // Get the user by ID
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update the user's email
    await updateEmailAddress(userId, email);

    res.status(200).json({ message: 'Email updated successfully' });
    console.log(`${userId}, ${email}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export { registerUser, logIn, getUserProfileData, updateUserEmail };
