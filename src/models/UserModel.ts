import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

// questionIDs on the left each match up to a question body on the right
const questions: QuestionData = {
  PlaceholderID1: 'Placeholder Question 1',
  PlaceholderID2: 'Placeholder Question 2',
};

// debugging function, should probably be removed later
async function getAllUsers(): Promise<User[]> {
  return userRepository.find();
}

async function addUser(username: string, email: string, passwordHash: string): Promise<User> {
  // 1) Create a new user object and set the properties
  let newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // 2) Save it in the database
  newUser = await userRepository.save(newUser);

  // DEBUG: print out new list of users
  console.log(await getAllUsers());

  // 3) Return the created user
  return newUser;
}

async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getUserByEmail(email: string): Promise<User | null | undefined> {
  const queriedUser = await userRepository.findOne({ where: { email } });

  return queriedUser;
}
async function getUserById(userId: string): Promise<User | null> {
  const queriedUser = await userRepository.findOne({
    select: {
      userId: true,
      username: true,
      email: true,
      verifiedEmail: true,
      profileViews: true,
      isSingle: true,
    },
    where: { userId },
  });
  return queriedUser;
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

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository.createQueryBuilder().update(User).set({ email: newEmail }).where({ userId });
}

// placeholder to stop compiler from complaining about questions never being read
function placeholderQuestion(): void {
  console.log(questions.PlaceholderID1);
}

export {
  getAllUsers,
  addUser,
  getAllUnverifiedUsers,
  getUserByEmail,
  getUserById,
  getUsersByViews,
  incrementProfileViews,
  updateEmailAddress,
  placeholderQuestion,
};
