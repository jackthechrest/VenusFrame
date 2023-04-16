import { AppDataSource } from '../dataSource';
import { Anniversary } from '../entities/Anniversary';

const anniversaryRepository = AppDataSource.getRepository(Anniversary);

async function addAnniversary(
  datingAnniversary: number,
  weddingAnniversary: number,
  birthday: number,
  specialday: string,
  specialdate: number
): Promise<Anniversary> {
  // Create the anniversary
  let newAnniversary = new Anniversary();
  newAnniversary.datingAnniversary = datingAnniversary;
  newAnniversary.weddingAnniversary = weddingAnniversary;
  newAnniversary.birthday = birthday;
  newAnniversary.specialday = specialday;
  newAnniversary.specialdate = specialdate;
  newAnniversary = await anniversaryRepository.save(newAnniversary);

  return newAnniversary;
}

async function getAnniversaryById(anniversaryId: string): Promise<Anniversary | null> {
  return await anniversaryRepository
    .createQueryBuilder('anniversary')
    .leftJoinAndSelect('anniversary.user', 'user')
    .select(['anniversary', 'user.userId', 'user.email'])
    .where('anniversaryId = :anniversaryId', { anniversaryId })
    .getOne();
}

async function userHasAnniversary(userId: string, anniversaryId: string): Promise<boolean> {
  const anniversaryExists = await anniversaryRepository
    .createQueryBuilder('anniversary')
    .leftJoinAndSelect('anniversary.user', 'user')
    .where('user.userId = :userId', { userId })
    .andWhere('anniversary.anniversaryId = :anniversaryId', { anniversaryId })
    .getExists();

  return anniversaryExists;
}

async function getAnniversaries(): Promise<Anniversary[]> {
  return await anniversaryRepository.find();
}

export { addAnniversary, getAnniversaryById, getAnniversaries, userHasAnniversary };
