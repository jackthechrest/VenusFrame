import { parseISO } from 'date-fns';
import { AppDataSource } from '../dataSource';
import { Reminder } from '../entities/Reminder';

import { User } from '../entities/User';

const reminderRepository = AppDataSource.getRepository(Reminder);

async function addReminder(
  sendNotificationOn: string,
  items: string[],
  user: User
): Promise<Reminder | null> {
  // Create the new user object
  let newReminder = new Reminder();
  newReminder.user = user;
  newReminder.items = items;
  newReminder.sendNotificationOn = parseISO(sendNotificationOn);

  newReminder = await reminderRepository.save(newReminder);

  return newReminder;
}

export { addReminder };
