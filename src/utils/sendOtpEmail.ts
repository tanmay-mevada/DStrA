import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  try {
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
      subject: '🔐 Verify your Email - DStrA',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 40px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <div style="background-color: #2563EB; padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0;">DStrA Email Verification</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi there,</p>
              <p style="font-size: 15px;">We received a request to create a new account using this email. Please verify your email address using the OTP below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #eef2ff; padding: 16px 32px; font-size: 24px; letter-spacing: 4px; font-weight: bold; border-radius: 8px; color: #1e40af;">
                  ${otp}
                </div>
              </div>
              <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. If you didn't initiate this request, you can safely ignore this email.</p>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">— The DStrA Team</p>
            </div>
            <div style="text-align: center; background-color: #f9fafb; padding: 15px; font-size: 12px; color: #999;">
              Need help? Contact support at <a href="mailto:support@dstra.com" style="color: #2563EB; text-decoration: none;">support@dstra.com</a>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Email send failed');
  }
}
