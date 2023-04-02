import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';
import { User } from '../entities/User';
import { updatePlay } from './UserModel';

// rules of love repository
const rolRepository = AppDataSource.getRepository(RulesOfLove);

async function startROL(
  gameId: string,
  player: User,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  let newROL = new RulesOfLove();
  newROL.gameId = gameId;

  const { players } = newROL;
  players.push(player);
  newROL.players = players;
  await updatePlay(player.userId, play);

  newROL = await rolRepository.save(newROL);

  return newROL;
}

async function joinROL(
  game: RulesOfLove,
  player: User,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  const updatedGame = game;
  updatedGame.players.push(player);
  await updatePlay(player.userId, play);

  await rolRepository.save(updatedGame);

  return updatedGame;
}

async function getROLById(gameId: string): Promise<RulesOfLove | null> {
  return rolRepository.findOne({ where: { gameId } });
}

async function getAllROL(): Promise<RulesOfLove[]> {
  return rolRepository.find();
}

async function endROLById(gameId: string): Promise<void> {
  await rolRepository
    .createQueryBuilder('rol')
    .delete()
    .from(RulesOfLove)
    .where('gameId = :gameId', { gameId })
    .execute();
}

export { startROL, joinROL, getROLById, getAllROL, endROLById };
