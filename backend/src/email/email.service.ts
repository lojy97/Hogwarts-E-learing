// email.service.ts (using Mailjet as an example)
import { Injectable } from '@nestjs/common';
import * as Mailjet from 'node-mailjet';

@Injectable()
export class EmailService {
  private mailjet: Mailjet.Client;

  constructor() {
    this.mailjet = new Mailjet.Client({
      apiKey: process.env.MAILJET_API_KEY, // Load API key from environment variable
      apiSecret: process.env.MAILJET_API_SECRET, // Load API secret from environment variable
    });
  }

  async sendVerificationEmail(email: string, token: string, userId: string) {
    const verificationLink = `https://your-api.com/auth/verify-email?token=${token}&userId=${userId}`;

    const request = this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'your-verified-email@example.com', // Your verified Mailjet email
            Name: 'Your Name or Company Name', // Optional sender name
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: 'Verify Your Email',
          HTMLPart: `
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
          `,
        },
      ],
    });

    try {
      const result = await request;
      console.log('Verification email sent successfully:', result.body);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  // ... other email sending methods (e.g., password reset)
}