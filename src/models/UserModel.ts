import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(username: string, email: string, passwordHash: string): Promise<User> {
  // 1) Create a new user object and set the properties
  let newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // 2) Save it in the database
  newUser = await userRepository.save(newUser);

  // 3) Return the created user
  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null | undefined> {
  const queriedUser = await userRepository.findOne({ where: { email } });

  return queriedUser;
}
/*
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
<<<<<<< Updated upstream
*/
export { addUser, getUserByEmail };
=======

export { addUser, getUserByEmail, getUserById };
>>>>>>> Stashed changes
