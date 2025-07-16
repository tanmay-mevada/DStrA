// lib/send-reset-email.ts
import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DStrA Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetLink}" style="padding: 10px 15px; background: #2563EB; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>If you didn't request this, just ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
