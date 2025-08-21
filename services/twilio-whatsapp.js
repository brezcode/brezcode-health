// Twilio WhatsApp Service
import dotenv from 'dotenv';

dotenv.config();

class TwilioWhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
  }

  // Check if Twilio is configured
  isConfigured() {
    return this.accountSid && this.authToken && this.fromNumber;
  }

  // Send WhatsApp message via Twilio
  async sendWhatsAppMessage(to, message) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured. Check your environment variables.');
    }

    try {
      // Format phone number for Twilio WhatsApp
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      const response = await fetch(`${this.baseUrl}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: formattedTo,
          Body: message
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`Twilio API Error: ${result.message || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      console.error('Twilio WhatsApp send error:', error);
      throw error;
    }
  }

  // Send verification code via WhatsApp
  async sendVerificationCode(phoneNumber, code) {
    const message = `🔐 BrezCode Health - Verification Code\n\nYour verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this message.`;
    
    return this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send health reminder via WhatsApp
  async sendHealthReminder(phoneNumber, reminder) {
    const message = `🏥 BrezCode Health - Reminder\n\n${reminder}\n\nTake care of your health! 💪`;
    
    return this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send health report via WhatsApp
  async sendHealthReport(phoneNumber, report) {
    const message = `📊 BrezCode Health - Your Health Report\n\n${report}\n\nKeep up the great work! 🌟`;
    
    return this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send appointment reminder via WhatsApp
  async sendAppointmentReminder(phoneNumber, appointment) {
    const message = `📅 BrezCode Health - Appointment Reminder\n\n${appointment}\n\nDon't forget your appointment! ⏰`;
    
    return this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send custom message via WhatsApp
  async sendTextMessage(phoneNumber, message) {
    return this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Get message status
  async getMessageStatus(messageSid) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/Messages/${messageSid}.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Twilio status check error:', error);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo() {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Twilio account info error:', error);
      throw error;
    }
  }
}

export default new TwilioWhatsAppService();
