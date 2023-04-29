import { AppDataSource } from '../dataSource';
import { getUserById } from './UserModel';
import { Follow } from '../entities/Follow';

const followRepository = AppDataSource.getRepository(Follow);

async function getFollowById(followId: string): Promise<Follow | null> {
  return await followRepository.findOne({ where: { followId } });
}

async function addFollow(requestingUserId: string, targetedUserId: string): Promise<Follow> {
  // Get users
  const requestingUser = await getUserById(requestingUserId);
  const targetedUser = await getUserById(targetedUserId);

  // update requesting user's following and targeted user's followers, save
  let newFollow = new Follow();
  newFollow.followId = targetedUser.username + requestingUser.username;
  newFollow.targetedUser = targetedUser;
  newFollow.requestingUser = requestingUser;

  newFollow = await followRepository.save(newFollow);
  return newFollow;
}

async function removeFollow(requestingUserId: string, targetedUserId: string): Promise<void> {
  // Get users
  const requestingUser = await getUserById(requestingUserId);
  const targetedUser = await getUserById(targetedUserId);

  // delete
  const followId = targetedUser.username + requestingUser.username;

  await followRepository
    .createQueryBuilder('follow')
    .delete()
    .where('followId = :followId', { followId })
    .execute();
}

export { getFollowById, addFollow, removeFollow };
