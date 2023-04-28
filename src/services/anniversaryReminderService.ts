import { isSameDay } from 'date-fns';
import { getAnniversaries } from '../models/AnniversaryModel';
import { sendEmail } from './emailService';

async function sendRemiderAnniversary(): Promise<void> {
  const anniversaries = await getAnniversaries();
  const today = new Date();
  for (const anniversary of anniversaries) {
    if (isSameDay(anniversary.datingAnniversary, today)) {
      const subject = `Reminder for your Anniversary`;
      const message = 'Today is your anniversary!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.birthday, today)) {
      const subject = `Reminder for your Anniversary`;
      const message = 'Today is your anniversary!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.weddingAnniversary, today)) {
      const subject = `Reminder for your Anniversary`;
      const message = 'Today is your anniversary!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.specialdate, today)) {
      const subject = `Reminder for your Anniversary`;
      const message = 'Today is your anniversary!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
  }
}

export { sendRemiderAnniversary };
