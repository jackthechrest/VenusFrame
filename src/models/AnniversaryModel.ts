import { AppDataSource } from '../dataSource';
import { Anniversary } from '../entities/Anniversary';
import { User } from '../entities/User';

const anniversaryRepository = AppDataSource.getRepository(Anniversary);

async function getAnniversaries(): Promise<Anniversary[]> {
  return await anniversaryRepository.find({ relations: ['user'] });
}

async function getAnniversaryByUserId(userId: string): Promise<Anniversary> {
  const anniversaries = await anniversaryRepository
    .createQueryBuilder('anniversary')
    .leftJoinAndSelect('anniversary.user', 'user')
    .select(['anniversary', 'user.userId', 'user.email'])
    .where('user.userId = :userId', { userId })
    .getOne();
  return anniversaries;
}

async function addAnniversary(
  datingAnniversary: number,
  weddingAnniversary: number | undefined,
  birthday: number,
  specialday: string | undefined,
  specialdate: number | undefined,
  user: User
): Promise<Anniversary> {
  let newAnniversary = await getAnniversaryByUserId(user.userId);
  if (!newAnniversary) {
    // Create the anniversary
    newAnniversary = new Anniversary();
    newAnniversary.user = user;
  }

  newAnniversary.datingAnniversary = datingAnniversary;
  newAnniversary.weddingAnniversary = weddingAnniversary;
  newAnniversary.birthday = birthday;
  newAnniversary.specialday = specialday;
  newAnniversary.specialdate = specialdate;

  newAnniversary = await anniversaryRepository.save(newAnniversary);

  return newAnniversary;
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

async function getAnniversaryById(anniversaryId: string): Promise<Anniversary | null> {
  return await anniversaryRepository
    .createQueryBuilder('anniversary')
    .where({ where: { anniversaryId } })
    .leftJoin('anniversary.user', 'user')
    .select([
      'anniversary.anniversaryId',
      'anniversary.datingAnniversary',
      'anniversary.birthday',
      'anniversary.weddingAnniversary',
      'anniversary.specialday',
      'anniversary.specialdate',
    ])
    .getOne();
}

async function deleteAnniversaryById(anniversaryId: string): Promise<void> {
  await anniversaryRepository
    .createQueryBuilder('anniversary')
    .delete()
    .where('anniversaryId = :anniversaryId', { anniversaryId })
    .execute();
}

export {
  addAnniversary,
  getAnniversaryByUserId,
  userHasAnniversary,
  getAnniversaryById,
  getAnniversaries,
  deleteAnniversaryById,
};
