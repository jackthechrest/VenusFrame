import { AppDataSource } from '../dataSource';
import { Partner } from '../entities/Partner';
import { userRepository } from './UserModel';

const partnerRepository = AppDataSource.getRepository(Partner);

async function getAllPartners(): Promise<Partner[]> {
  return partnerRepository.find();
}

async function getPartnerById(partnerId: string): Promise<Partner | null> {
  const queriedPartner = await partnerRepository.findOne({
    where: { partnerId },
    relations: ['userOne', 'userTwo'],
  });

  return queriedPartner;
}

async function addPartner(
  userOneId: string,
  userTwoId: string,
  datingAnniversary: Date
): Promise<Partner> {
  let newPartner = new Partner();
  // newPartner.userOne = await userRepository.findOne(userOneId);
  // newPartner.userTwo = await userRepository.findOne(userTwoId);
  newPartner.datingAnniversary = datingAnniversary;

  newPartner = await partnerRepository.save(newPartner);

  return newPartner;
}

async function updateMarriageAnniversary(
  partnerId: string,
  marriageAnniversary: Date
): Promise<void> {
  await partnerRepository
    .createQueryBuilder()
    .update(Partner)
    .set({ marriageAnniversary })
    .where({ partnerDataId: partnerId })
    .execute();
}

export { getAllPartners, addPartner, getPartnerById, updateMarriageAnniversary, userRepository };
