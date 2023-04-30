import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';
import { User } from '../entities/User';
import { getUserById, addROL, updateUserStreaksROL } from './UserModel';

// rules of love repository
const rolRepository = AppDataSource.getRepository(RulesOfLove);

async function getROLById(gameId: string): Promise<RulesOfLove | null> {
  return rolRepository.findOne({ where: { gameId }, relations: ['players'] });
}

async function startROL(
  gameId: string,
  userId: string,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  let newROL = new RulesOfLove();
  newROL.gameId = gameId;
  await addROL(userId, play, newROL);

  newROL = await rolRepository.save(newROL);

  return newROL;
}

async function joinROL(
  gameId: string,
  userId: string,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  const updatedROL = await getROLById(gameId);
  await addROL(userId, play, updatedROL);

  updatedROL.players.push(await getUserById(userId));

  await rolRepository.save(updatedROL);

  return updatedROL;
}

async function playROL(gameId: string, player1: User, player2: User): Promise<RulesOfLove> {
  let ROL = await getROLById(gameId);

  // placeholder for rendering purposes.
  ROL.winnerName = player1.username;
  ROL.winnerChoice = player1.currentPlay;
  ROL.loserName = player2.username;
  ROL.loserChoice = player2.currentPlay;
  ROL.winnerStreak = player1.currentWinStreak;

  if (player1.currentPlay === player2.currentPlay) {
    console.log('DRAW');
  } else if (
    (player1.currentPlay === 'Rock Candy Heart' && player2.currentPlay === 'Candle') ||
    (player1.currentPlay === 'Box of Chocolates' && player2.currentPlay === 'Rock Candy Heart') ||
    (player1.currentPlay === 'Candle' && player2.currentPlay === 'Box of Chocolates')
  ) {
    console.log(`${player1.username} WINS`);
    await updateUserStreaksROL(player1.userId, player2.userId);
  } else {
    console.log(`${player2.username} WINS`);
    ROL.winnerName = player2.username;
    ROL.winnerChoice = player2.currentPlay;
    ROL.loserName = player1.username;
    ROL.loserChoice = player1.currentPlay;
    await updateUserStreaksROL(player2.userId, player1.userId);
    ROL.winnerStreak = player2.currentWinStreak;
  }

  ROL.gameOver = true;
  ROL = await rolRepository.save(ROL);

  return ROL;
}

async function endROLById(gameId: string): Promise<void> {
  await rolRepository
    .createQueryBuilder('rol')
    .delete()
    .where('gameId = :gameId', { gameId })
    .execute();
}

async function clearAllROL(): Promise<void> {
  await rolRepository.createQueryBuilder('rol').delete().execute();
}

export { getROLById, startROL, joinROL, playROL, endROLById, clearAllROL };
