// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send notification email to you
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'tanmaymevada24@gmail.com',
      replyTo: email,
      subject: `DStrA Contact: Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        <hr>
        <p><small>This message was sent from the DStrA contact form.</small></p>
      `
    });

    // Send thank you email to the sender
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting DStrA!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Thank you for reaching out!</h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting me through the DStrA platform. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #495057;">Your message:</h4>
            <p style="margin-bottom: 0; font-style: italic;">
              "${message.replace(/\n/g, '<br>')}"
            </p>
          </div>
          
          <p>I typically respond within 24 hours. In the meantime, feel free to:</p>
          <ul>
            <li>Explore the <strong>DStrA</strong> platform for Data Structures learning</li>
            <li>Check out my <a href="https://github.com/tanmay-mevada" style="color: #007bff;">GitHub</a> for more projects</li>
            <li>Visit my <a href="https://myportfolio-nine-eta-17.vercel.app/" style="color: #007bff;">portfolio</a> to learn more about my work</li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Tanmay Mevada</strong><br>
          <small>Developer, DStrA Platform</small></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="font-size: 12px; color: #6c757d;">
            This is an automated response. Please do not reply directly to this email.
            If you need immediate assistance, you can reach out via GitHub or my portfolio contact form.
          </p>
        </div>
      `
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully! Check your email for confirmation.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}