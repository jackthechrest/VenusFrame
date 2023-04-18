import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';
import { addROL, getUserById } from './UserModel';

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
