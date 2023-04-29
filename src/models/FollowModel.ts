import { AppDataSource } from '../dataSource';
import { getUserById } from './UserModel';
import { Follow } from '../entities/Follow';

const followRepository = AppDataSource.getRepository(Follow);

async function getFollowById(followId: string): Promise<Follow | null> {
  return await followRepository.findOne({
    where: { followId },
  });
}

async function addFollow(requestingUserId: string, targetedUserId: string): Promise<Follow> {
  // Get users
  const requestingUser = await getUserById(requestingUserId);
  const targetedUser = await getUserById(targetedUserId);

  // update requesting user's following and targeted user's followers, save
  let newFollow = new Follow();
  newFollow.followId = targetedUserId + requestingUserId;
  newFollow.targetUserId = targetedUserId;
  newFollow.targetUsername = targetedUser.username;
  newFollow.targetedUser = targetedUser;
  newFollow.requestUserId = requestingUserId;
  newFollow.requestUsername = requestingUser.username;
  newFollow.requestingUser = requestingUser;

  newFollow = await followRepository.save(newFollow);
  return newFollow;
}

async function removeFollow(requestingUserId: string, targetedUserId: string): Promise<void> {
  // delete
  const followId = targetedUserId + requestingUserId;

  await followRepository
    .createQueryBuilder('follow')
    .delete()
    .where('followId = :followId', { followId })
    .execute();
}

async function clearFollowsById(userId: string): Promise<void> {
  const user = await getUserById(userId);

  while (user.followers.length > 0) {
    const { followId } = user.followers.pop();
    await followRepository
      .createQueryBuilder('follow')
      .delete()
      .where('followId = :followId', { followId })
      .execute();
  }

  while (user.following.length > 0) {
    const { followId } = user.following.pop();
    await followRepository
      .createQueryBuilder('follow')
      .delete()
      .where('followId = :followId', { followId })
      .execute();
  }
}

async function deleteAllFollows(): Promise<void> {
  await followRepository.createQueryBuilder('follow').delete().execute();
}

export { getFollowById, addFollow, removeFollow, clearFollowsById, deleteAllFollows };
