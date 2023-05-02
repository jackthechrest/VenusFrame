import { isSameDay } from 'date-fns';
import { getAnniversaries } from '../models/AnniversaryModel';
import { sendEmail } from './emailService';

async function sendReminderAnniversary(): Promise<void> {
  const anniversaries = await getAnniversaries();
  const today = new Date();
  for (const anniversary of anniversaries) {
    if (isSameDay(anniversary.datingAnniversary, today)) {
      const subject = `Happy Anniversary from VenusFrame!`;
      const message =
        'Today is your Dating Anniversary! Hope you have a wonderful day with your partner!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.birthday, today)) {
      const subject = `Happy Birthday from VenusFrame!`;
      const message = 'Today is your Birtday! Hope you have a wonderful day! Happy Birthday!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.weddingAnniversary, today)) {
      const subject = `Happy Wedding Anniversary from VenusFrame!`;
      const message =
        'Today is your Wedding Anniversary! Hope you have a wondeful day with your partner!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
    if (isSameDay(anniversary.specialdate, today)) {
      const subject = `Happy special day from VenusFrame!`;
      const message =
        'Today is your Speicial Day! Hope you have a wondeful day with your partner!\n';
      await sendEmail(anniversary.user.email, subject, message);
    }
  }
}

export { sendReminderAnniversary };
