import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';

// rules of love repository
const rolRepository = AppDataSource.getRepository(RulesOfLove);

async function startROL(gameId: string): Promise<RulesOfLove> {
  let newROL = new RulesOfLove();
  newROL.gameId = gameId;

  newROL = await rolRepository.save(newROL);

  return newROL;
}

async function getROLById(gameId: string): Promise<RulesOfLove | null> {
  return rolRepository.findOne({ where: { gameId } });
}

async function getAllROL(): Promise<RulesOfLove[]> {
  return rolRepository.find();
}

export { startROL, getROLById, getAllROL };
