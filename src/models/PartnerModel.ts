import { AppDataSource } from '../dataSource';
import { Partner } from '../entities/Partner';

const partnerRepository = AppDataSource.getRepository(Partner);

async function getPartnerById(partnerId: string): Promise<Partner | null> {
  const partner = await partnerRepository.findOne({ where: { partnerId } });
  return partner;
}

export { getPartnerById };
