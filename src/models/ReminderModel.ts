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

async function deleteRemindersByUserId(userId: string): Promise<void> {
  const user = await getUserById(userId);

  while (user.reminders.length > 0) {
    const { reminderId } = user.reminders.pop();
    await reminderRepository
      .createQueryBuilder('reminder')
      .delete()
      .where('reminderId = :reminderId', { reminderId })
      .execute();
  }
}

export { addReminder, deleteRemindersByUserId };
