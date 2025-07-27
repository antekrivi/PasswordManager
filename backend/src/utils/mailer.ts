import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
});

export const sendHintEmail = async (to: string, hint: string) => {
  console.log(`Sending password hint to ${to}`);
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP error:", error);
    } else {
      console.log("Mailer ready");
    }
  });
  await transporter.sendMail({
    from: '"Password Manager" <yourapp@example.com>',
    to,
    subject: 'Password Hint',
    text: `Here is your password hint: ${hint}`
  });
};
