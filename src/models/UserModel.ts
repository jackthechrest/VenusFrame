import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { RulesOfLove } from '../entities/RulesOfLove';

const userRepository = AppDataSource.getRepository(User);

function generateTypeCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const length = 6;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function addUser(username: string, email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let typeCode;
  const isTypeCodeUnique = false;
  while (!isTypeCodeUnique) {
    typeCode = generateTypeCode();
    const existingUser = await userRepository.findOne({ where: { typeCode } });
    if (!existingUser) {
      break;
    }
  }
  let newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  newUser.typeCode = generateTypeCode();
  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

async function allUserData(): Promise<User[]> {
  return userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({
    where: { userId },
    relations: ['partner', 'answers', 'reminders', 'anniversary'], // 'following', 'followers'],
  });
  return user;
}

async function getUsersByViews(minViews: number): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews', { minViews }) // NOTES: the parameter `:minViews` must match the key name `minViews`
    .select(['user.email', 'user.profileViews', 'user.joinedOn', 'user.userId'])
    .getMany();

  return users;
}

async function incrementProfileViews(userData: User): Promise<User> {
  const updatedUser = userData;
  updatedUser.profileViews += 1;

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: updatedUser.profileViews })
    .where({ userId: updatedUser.userId })
    .execute();

  return updatedUser;
}

async function resetAllProfileViews(): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: 0 })
    .where('verifiedEmail <> true')
    .execute();
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function addROL(
  userId: string,
  newPlay: RulesOfLoveOptions,
  rol: RulesOfLove
): Promise<void> {
  const user = await getUserById(userId);
  user.currentPlay = newPlay;
  user.rolInfo = rol;
  await userRepository.save(user);
}

async function deleteUserById(userId: string): Promise<void> {
  await userRepository
    .createQueryBuilder('user')
    .delete()
    .where('userId = :userId', { userId })
    .execute();
}

async function deleteAllUsers(): Promise<void> {
  await userRepository.createQueryBuilder('user').delete().execute();
}

async function getRemindersDueInOneDay(): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .select(['user.userId', 'user.email', 'user.username'])
    .getMany();

  console.log(`sending reminders to ${users.length} users`);

  return users;
}

async function typeCodeExists(typeCode: string): Promise<boolean> {
  const reviewExists = await userRepository
    .createQueryBuilder('user')
    .where('typeCode = :typeCode', { typeCode })
    .getExists();

  return reviewExists;
}

async function addPartnerToUserByTypeCode(
  userId: string,
  partnerTypeCode: string
): Promise<User | null> {
  const user = await getUserById(userId);
  // Find the partner by their typeCode
  const partner = await userRepository.findOne({ where: { typeCode: partnerTypeCode } });

  if (!partner) {
    return null;
  }

  // Associate the partner with the user
  user.partner = partner;
  partner.partner = user;

  // Save the changes to the database
  await userRepository.save(user);
  await userRepository.save(partner);
  return await getUserById(userId);
}

async function addFollow(requestingUserId: string, targetedUserId: string): Promise<void> {
  // Get users
  const requestingUser = await getUserById(requestingUserId);
  const targetedUser = await getUserById(targetedUserId);

  // update requesting user's following and targeted user's followers
  requestingUser.following.push(targetedUser);
  targetedUser.followers.push(requestingUser);

  // save changes to repository
  await userRepository.save(requestingUser);
  await userRepository.save(targetedUser);
}

async function removeFollow(requestingUserId: string, targetedUserId: string): Promise<void> {
  // Get users
  const requestingUser = await getUserById(requestingUserId);
  const targetedUser = await getUserById(targetedUserId);

  // update requesting user's following and targeted user's followers
  const followingIndex = requestingUser.following.indexOf(targetedUser);
  const followerIndex = targetedUser.followers.indexOf(requestingUser);

  if (followingIndex !== -1) {
    requestingUser.following.splice(followingIndex, 1);
    targetedUser.followers.splice(followerIndex, 1);
  }

  // save changes to repository
  await userRepository.save(requestingUser);
  await userRepository.save(targetedUser);
}

export {
  addUser,
  getUserByEmail,
  getUserById,
  getUsersByViews,
  incrementProfileViews,
  allUserData,
  resetAllProfileViews,
  updateEmailAddress,
  addROL,
  deleteUserById,
  deleteAllUsers,
  getRemindersDueInOneDay,
  generateTypeCode,
  addPartnerToUserByTypeCode,
  typeCodeExists,
  addFollow,
  removeFollow,
};
