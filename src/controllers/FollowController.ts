import { Request, Response } from 'express';
import { getUserById } from '../models/UserModel';
import { getFollowById, addFollow, removeFollow } from '../models/FollowModel';
import { parseDatabaseError } from '../utils/db-utils';

async function followUser(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
  }

  const { targetUserId } = req.params;
  const targetUser = await getUserById(targetUserId);
  const requestingUser = await getUserById(authenticatedUser.userId);

  const followData = await getFollowById(targetUser.username + requestingUser.username);
  if (!targetUser || followData) {
    res.redirect(`/users/${authenticatedUser.userId}`);
  }

  try {
    await addFollow(authenticatedUser.userId, targetUserId);
    res.redirect(`/users/${targetUserId}`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function unfollowUser(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
  }

  const { targetUserId } = req.params;
  const targetUser = await getUserById(targetUserId);
  const requestingUser = await getUserById(authenticatedUser.userId);

  const followData = await getFollowById(targetUser.username + requestingUser.username);
  if (!targetUser || !followData) {
    res.redirect(`/users/${authenticatedUser.userId}`);
  }

  await removeFollow(authenticatedUser.userId, targetUserId);
  res.redirect(`/users/${targetUserId}`);
}

async function renderFollowingPage(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  const { targetUserId } = req.params;

  const targetUser = await getUserById(targetUserId);

  if (!targetUser) {
    if (!isLoggedIn) {
      res.redirect(`/index`);
    } else {
      res.redirect(`/users/${authenticatedUser.userId}`);
    }
  }

  res.render('following', { user: targetUser });
}

async function renderFollowersPage(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  const { targetUserId } = req.params;

  const targetUser = await getUserById(targetUserId);

  if (!targetUser) {
    if (!isLoggedIn) {
      res.redirect(`/index`);
    } else {
      res.redirect(`/users/${authenticatedUser.userId}`);
    }
  }

  res.render('followers', { user: targetUser });
}

export { followUser, unfollowUser, renderFollowingPage, renderFollowersPage };
