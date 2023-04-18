import { Request, Response } from 'express';
import { User } from '../entities/User';
import { startROL, getROLById, joinROL } from '../models/RulesOfLoveModel';
import { getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function intermediateRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId, newPlay } = req.body as RulesOfLoveBody;
  console.log(`GameId: ${gameId}\nnewPlay: ${newPlay}`);

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    // res.sendStatus(404); // 404 not found
    res.redirect('/index');
    return;
  }
  // try to join game with the id
  let game = await getROLById(gameId);

  // game did not exist already, make a new one with that id
  if (!game) {
    try {
      game = await startROL(gameId, user.userId, newPlay);
      console.log(`${user.username} CREATE: ${JSON.stringify(game)}`);
      res.redirect('/waitingRoom');
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
    }
  } else if (game.players.length === 2 || game.players[0].userId === user.userId) {
    // full game or player is joining game they already started
    console.log(`${user.username} FULL: ${JSON.stringify(game)}`);
    res.redirect('/rulesoflove');
  } else {
    game = await joinROL(game.gameId, user.userId, newPlay);
    console.log(`${user.username} JOIN: ${JSON.stringify(user.rolInfo)}`);
    res.redirect(`/rulesoflove/${gameId}`);
  }
}

async function playRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;
  const game = await getROLById(gameId);

  if (!game || game.players.length !== 2) {
    res.redirect('/waitingRoom');
  }
  console.log(JSON.stringify(game));

  const player1 = game.players[0];
  const player2 = game.players[1];

  let isDraw: boolean = false;
  let winner: User = player1;
  let loser: User = player2;

  if (player1.currentPlay === player2.currentPlay) {
    console.log('DRAW');
    isDraw = true;
  } else if (
    (player1.currentPlay === 'Rock Candy Heart' && player2.currentPlay === 'Candle') ||
    (player1.currentPlay === 'Box of Chocolates' && player2.currentPlay === 'Rock Candy Heart') ||
    (player1.currentPlay === 'Candle' && player2.currentPlay === 'Box of Chocolates')
  ) {
    console.log(`${player1.username} WINS`);
  } else {
    console.log(`${player2.username} WINS`);
    winner = player2;
    loser = player1;
  }
  res.render('rolResults', { isDraw, winner, loser });
}

export { intermediateRulesOfLove, playRulesOfLove };
