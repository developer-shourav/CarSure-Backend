import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (mailReceiver: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use false for 587, true for 465
    auth: {
      user: config.nodemailer_user,
      pass: config.nodemailer_pass,
    },
  });

  await transporter.sendMail({
    from: `"University Manager" <${config.nodemailer_user}>`,
    to: mailReceiver,
    subject: 'Password Reset Link',
    text: 'Email for Password Reset',
    html: `<b>Click on the link to reset your password: </b><a href="${resetLink}">${resetLink}</a>`,
  });

  console.log('Email sent successfully');
};
