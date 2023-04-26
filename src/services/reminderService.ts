import { getRemindersDueInOneDay } from '../models/UserModel';
import { sendEmail } from './emailService';
import { User } from '../entities/User';

async function sendReminders(users: User[]): Promise<void> {
  const date = new Date();
  for (const user of users) {
    const subject = `Reminder for ${date.toLocaleDateString()}`;
    const message = 'Your daily question for the day is up.\n';
    await sendEmail(user.email, subject, message);
  }
}

async function sendOneDayReminders(): Promise<void> {
  const users = await getRemindersDueInOneDay();
  await sendReminders(users);
}

export { sendReminders, sendOneDayReminders };
