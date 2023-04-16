import { getRemindersDueInOneDay } from '../models/UserModel';
import { sendEmail } from './emailService';
import { User } from '../entities/User';

async function sendReminders(users: User[]): Promise<void> {
  for (const user of users) {
    for (const reminder of user.reminders) {
      const { sendNotificationOn, items } = reminder;

      const subject = `Reminder for ${sendNotificationOn.toLocaleDateString()}`;
      let message = 'Reminder Items:\n';

      for (const item of items) {
        message += `   - ${item}\n`;
      }

      await sendEmail(user.email, subject, message);
    }
  }
}

async function sendOneDayReminders(): Promise<void> {
  const users = await getRemindersDueInOneDay();
  await sendReminders(users);
}

export { sendReminders, sendOneDayReminders };
