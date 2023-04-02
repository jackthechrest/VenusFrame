import { Request, Response } from 'express';
import { startROL, getROLById, endROLById, joinROL } from '../models/RulesOfLoveModel';
import { getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function playRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId, userId } = req.params;
  const { newPlay } = req.body as RulesOfLoveBody;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404); // 404 not found
    return;
  }

  // try to join game with the id
  let game = await getROLById(gameId);

  // game did not exist already, make a new one with that id
  if (!game) {
    try {
      game = await startROL(gameId, user, newPlay);
      console.log(`${user.username} has created Rules of Love ${game.gameId}`);
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
    }
  } else if (game.players.length === 2) {
    // check to make sure not too many players before adding
    res.sendStatus(409); // 409 Conflict
  } else {
    game = await joinROL(game, user, newPlay);
    console.log(`${user.username} has joined Rules of Love ${game.gameId}`);

    // if a game was joined, then the game can be played
    if (game.players.length === 2) {
      // players[0] wins
      if (
        (game.players[0].currentPlay === 'Rock Candy Heart' &&
          game.players[1].currentPlay === 'Candle') ||
        (game.players[0].currentPlay === 'Box of Chocolates' &&
          game.players[1].currentPlay === 'Rock Candy Heart') ||
        (game.players[0].currentPlay === 'Candle' &&
          game.players[1].currentPlay === 'Box of Chocolates')
      ) {
        // update current win streaks
        console.log(`${game.players[0].username} beat ${game.players[1].username}\n`);
        game.players[0].currentWinStreak += 1;
        game.players[1].currentWinStreak = 0;

        // check if highest win streak should be updated
        if (game.players[0].currentWinStreak > game.players[0].highestWinStreak)
          game.players[0].highestWinStreak = game.players[0].currentWinStreak;
      } // draw
      else if (game.players[0].currentPlay === game.players[1].currentPlay) {
        console.log(`${game.players[0].username} and ${game.players[1].username} have drawn\n`);
      } // players[1] wins
      else {
        // update current win streaks
        console.log(`${game.players[1].username} beat ${game.players[0].username}\n`);
        game.players[1].currentWinStreak += 1;
        game.players[0].currentWinStreak = 0;

        // check if highest win streak should be updated
        if (game.players[1].currentWinStreak > game.players[1].highestWinStreak)
          game.players[1].highestWinStreak = game.players[1].currentWinStreak;
      }
      // end game
      await endROLById(gameId);
    }

    res.sendStatus(201); // 201 OK
  }
}

export { playRulesOfLove };
