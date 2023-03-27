import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail(to: string, subject: string, message: string): Promise<void> {
  await transporter.sendMail({
    to,
    subject,
    text: message,
  });
}

export { sendEmail };
