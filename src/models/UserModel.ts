import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string): Promise<User> {
  // 1) Create a new user object and set the properties
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // 2) Save it in the database
  newUser = await userRepository.save(newUser);

  // 3) Return the created user
  return newUser;
}

async function getUserByEmail(queriedEmail: string): Promise<User | null | undefined> {
  const queriedUser = await userRepository.findOne({
    select: {
      email: true,
    },
    where: {
      email: queriedEmail,
    },
  });

  if (queriedUser == null) return undefined;

  return queriedUser;
}

export { addUser, getUserByEmail };
