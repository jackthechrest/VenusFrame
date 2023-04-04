// import { getUserReminders, getRemindersDueInOneWeek } from '../models/UserModel';
// import { sendEmail } from './emailService';
// import { User } from '../entities/User';

// async function sendReminders(users: User[]): Promise<void> {
//   for (const user of users) {
//     const reminders = await getUserReminders(user.userId);
//     const remindersDueInOneWeek = getRemindersDueInOneWeek(reminders);

//     for (const reminder of remindersDueInOneWeek) {
//       const { sendNotificationOn, items } = reminder;

//       const subject = `Reminder for ${sendNotificationOn.toLocaleDateString()}`;
//       let message = 'Reminder Items:\n';

//       for (const item of items) {
//         message += `   - ${item}\n`;
//       }

//       await sendEmail(user.email, subject, message);
//     }
//   }
// }
