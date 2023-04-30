import { Request, Response } from 'express';
import {
  startROL,
  getROLById,
  joinROL,
  playROL,
  removePlayerFromROL,
  clearAllROL,
} from '../models/RulesOfLoveModel';
import { getUserById, resetAllROL } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function startRulesOfLove(req: Request, res: Response): Promise<void> {
  // verify user is logged in and exists
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.redirect('/index');
    return;
  }

  // user not in game
  if (!user.rolInfo) {
    res.redirect('/rulesoflove');
    return;
  }

  // user in game, redirect to it
  res.redirect(`/rulesoflove/${user.rolInfo.gameId}`);
}

async function playRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId, newPlay } = req.body as RulesOfLoveBody;

  // make sure user is logged in and exists
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.redirect('/index');
    return;
  }

  // try to join game with the id
  let game = await getROLById(gameId);

  // game did not exist already, make a new one with that id
  if (!game) {
    try {
      game = await startROL(gameId, user.userId, newPlay);
      // console.log(`${user.username} CREATE: ${JSON.stringify(game)}`);
      res.redirect(`/rulesoflove/${gameId}`);
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
    }
  } else if (game.players.length === 2 || game.players[0].userId === user.userId || game.gameOver) {
    // full game, player is joining game they already started, or game is over
    // console.log(`${user.username} FULL: ${JSON.stringify(game)}`);
    res.redirect('/rulesoflove');
  } else {
    game = await joinROL(game.gameId, user.userId, newPlay);
    // console.log(`${user.username} JOIN: ${JSON.stringify(user.rolInfo)}`);
    res.redirect(`/rulesoflove/${gameId}`);
  }
}

async function renderRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;

  // make sure user is logged in, exists, and that game exists
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.redirect('/index');
    return;
  }

  let game = await getROLById(gameId);
  if (!game) {
    res.redirect('/rulesoflove');
    return;
  }

  // check for draw (if game happened already)
  let isDraw = false;

  if (game.players[1] && game.players[0].currentPlay === game.players[1].currentPlay) {
    isDraw = true;
  }

  // play game if there are 2 players and game hasn't already been played
  if (game.players.length === 2 && !game.gameOver) {
    game = await playROL(gameId, game.players[0], game.players[1]);
  }

  res.render('rolResults', {
    rol: game,
    player1: game.players[0],
    isDraw,
  });
}

async function exitROL(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;
  // make sure user is logged in and exists
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.redirect('/index');
    return;
  }

  // make sure game exists and that the player is in it
  const game = await getROLById(gameId);
  if (!game) {
    res.redirect('/rulesoflove/play');
    return;
  }

  let notValidPlayer = true;
  for (const player of game.players) {
    if (player.userId === user.userId) {
      notValidPlayer = false;
    }
  }

  if (notValidPlayer) {
    res.redirect('/rulesoflove/play');
    return;
  }

  await removePlayerFromROL(game.gameId, user);
  res.redirect('/users/PreviewPage');
}

async function deleteAllROL(res: Response): Promise<void> {
  await resetAllROL();
  await clearAllROL();
  res.redirect('/index');
}

export { startRulesOfLove, playRulesOfLove, renderRulesOfLove, exitROL, deleteAllROL };
