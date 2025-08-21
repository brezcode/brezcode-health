// WhatsApp Business API Service
import dotenv from 'dotenv';

dotenv.config();

class WhatsAppService {
  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  // Check if WhatsApp is configured
  isConfigured() {
    return this.apiKey && this.phoneNumberId && this.accessToken;
  }

  // Send text message
  async sendTextMessage(phoneNumber, message) {
    if (!this.isConfigured()) {
      throw new Error('WhatsApp not configured. Check your environment variables.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`WhatsApp API Error: ${result.error?.message || 'Unknown error'}`);
      }

      return result;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  // Send health verification code
  async sendVerificationCode(phoneNumber, code) {
    const message = `🔐 BrezCode Health - Verification Code\n\nYour verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this message.`;
    
    return this.sendTextMessage(phoneNumber, message);
  }

  // Send health reminder
  async sendHealthReminder(phoneNumber, reminder) {
    const message = `🏥 BrezCode Health - Reminder\n\n${reminder}\n\nTake care of your health! 💪`;
    
    return this.sendTextMessage(phoneNumber, message);
  }

  // Send health report
  async sendHealthReport(phoneNumber, report) {
    const message = `📊 BrezCode Health - Your Health Report\n\n${report}\n\nKeep up the great work! 🌟`;
    
    return this.sendTextMessage(phoneNumber, message);
  }

  // Send appointment reminder
  async sendAppointmentReminder(phoneNumber, appointment) {
    const message = `📅 BrezCode Health - Appointment Reminder\n\n${appointment}\n\nDon't forget your appointment! ⏰`;
    
    return this.sendTextMessage(phoneNumber, message);
  }

  // Get message status
  async getMessageStatus(messageId) {
    if (!this.isConfigured()) {
      throw new Error('WhatsApp not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      return await response.json();
    } catch (error) {
      console.error('WhatsApp status check error:', error);
      throw error;
    }
  }
}

export default new WhatsAppService();
