import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string, userId: string) {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}&userId=${userId}`;

    console.log('Verification link:', verificationLink);

    const msg = {
      to: email,
      from: 'your-verified-email@example.com', // Your verified SendGrid email
      subject: 'Verify Your Email',
      html: `
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
      mailSettings: {
        sandboxMode: {
          enable: true, // Enable Sandbox Mode for this request
        },
      },
    };

    try {
      await SendGrid.send(msg);
      console.log('Verification email sent successfully (Sandbox Mode)');
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}