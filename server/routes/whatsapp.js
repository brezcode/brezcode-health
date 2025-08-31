import express from 'express';
const router = express.Router();

// WhatsApp Business API configuration
// You'll need to replace these with your actual credentials
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages';
const WHATSAPP_ACCESS_TOKEN = 'YOUR_WHATSAPP_ACCESS_TOKEN';

// Daily health tips that rotate
const DAILY_TIPS = [
  {
    title: "The 10-14 Day Rule",
    content: "Check your breasts 10-14 days after your period ends when they're least tender. Most lumps disappear after your period - that's normal! 🌸",
    category: "Early Detection"
  },
  {
    title: "Green Tea Power", 
    content: "Drinking 2-3 cups of green tea daily can reduce breast cancer risk by up to 10%. The EGCG compound helps your body fight abnormal cells. 🍵✨",
    category: "Nutrition"
  },
  {
    title: "4-7-8 Breathing",
    content: "Stressed? Try this: inhale 4, hold 7, exhale 8. Repeat 4 times. Chronic stress suppresses immunity - this activates your relaxation response! 🧘‍♀️",
    category: "Stress Management"
  },
  {
    title: "150 Minutes = Life Insurance",
    content: "Just 150 minutes of exercise weekly (21 min/day) reduces breast cancer risk by 20-30%! Even brisk walking counts. Your health is worth 21 minutes! 🚶‍♀️💪",
    category: "Movement"
  },
  {
    title: "Mediterranean Magic",
    content: "Women following Mediterranean diet have 15-20% lower breast cancer risk. Olive oil + fish + nuts + colorful veggies = powerful protection! 🥗🐟",
    category: "Nutrition"
  },
  {
    title: "Sleep = Repair Time",
    content: "Less than 6 hours sleep increases breast cancer risk by 50%! During deep sleep, your body repairs DNA and produces cancer-fighting melatonin. 😴✨",
    category: "Recovery"
  },
  {
    title: "Fiber is Your Friend",
    content: "25-30g daily fiber helps eliminate excess estrogen through bowel movements. Think of fiber as your internal cleaning crew! 🧹💚",
    category: "Nutrition"
  },
  {
    title: "Strength Training Benefits",
    content: "Lifting weights reduces estrogen levels and increases metabolism - both protective against breast cancer. Strong women are healthy women! 💪👑",
    category: "Movement"
  }
];

// Activity reminders with personalization
const ACTIVITY_REMINDERS = [
  {
    time: 'morning',
    message: "🌅 Good morning, beautiful! Ready for your 5-minute breast massage? Your body will thank you for this self-care ritual. ✨"
  },
  {
    time: 'afternoon',
    message: "⏰ Afternoon boost time! How about that 30-minute walk? Your cells love oxygen, and you deserve this 'me time'. 🚶‍♀️💚"
  },
  {
    time: 'evening',
    message: "🌙 Evening reflection: Did you drink your green tea today? Small habits create big changes. You're building health one day at a time! 🍵"
  }
];

// Motivational messages for streaks
const STREAK_MESSAGES = [
  "🔥 Amazing! 3-day streak! You're building powerful healthy habits!",
  "⭐ Incredible! 7-day streak! You're officially a breast health champion!",
  "🏆 Outstanding! 14-day streak! You're an inspiration to other women!",
  "👑 Phenomenal! 21-day streak! You've created a lifestyle transformation!",
  "💎 Legendary! 30-day streak! You're a true health warrior!"
];

// Helper function to send WhatsApp message
async function sendWhatsAppMessage(phoneNumber, message, messageType = 'text') {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: messageType,
        text: {
          body: message
        }
      }),
    });

    const result = await response.json();
    console.log('WhatsApp message sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('WhatsApp message failed:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to send interactive message with buttons
async function sendInteractiveMessage(phoneNumber, message, buttons) {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: message
          },
          action: {
            buttons: buttons
          }
        }
      }),
    });

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error('Interactive WhatsApp message failed:', error);
    return { success: false, error: error.message };
  }
}

// Opt-in endpoint
router.post('/opt-in', async (req, res) => {
  try {
    const { userId, phoneNumber, preferences } = req.body;

    if (!userId || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and phone number are required' 
      });
    }

    // Send welcome message with interactive buttons
    const welcomeMessage = `🌟 Welcome to BrezCode Health!

I'm your personal breast health coach. I'll send you:
• Daily evidence-based health tips
• Personalized activity reminders  
• Monthly BSE reminders
• Weekly progress celebrations

Ready to start your health transformation journey?`;

    const welcomeButtons = [
      {
        type: "reply",
        reply: {
          id: "yes_start",
          title: "✅ Yes, let's start!"
        }
      },
      {
        type: "reply",
        reply: {
          id: "learn_more",
          title: "📚 Learn more first"
        }
      }
    ];

    const result = await sendInteractiveMessage(phoneNumber, welcomeMessage, welcomeButtons);

    if (result.success) {
      // Store user preferences in database
      // TODO: Add database logic here
      console.log('User opted in:', { userId, phoneNumber, preferences });
      
      res.json({
        success: true,
        message: 'WhatsApp opt-in message sent successfully',
        whatsappMessageId: result.result.messages[0].id
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send WhatsApp message',
        details: result.error
      });
    }
  } catch (error) {
    console.error('WhatsApp opt-in error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Send daily tip
router.post('/send-daily-tip', async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;
    
    // Get random daily tip
    const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    
    const message = `💡 Today's Breast Health Insight

*${tip.title}*

${tip.content}

Category: ${tip.category}

Remember: Small daily actions create big health transformations! 💪✨`;

    const buttons = [
      {
        type: "reply",
        reply: {
          id: "tip_helpful",
          title: "❤️ Helpful!"
        }
      },
      {
        type: "reply",
        reply: {
          id: "learn_more",
          title: "📖 Learn more"
        }
      }
    ];

    const result = await sendInteractiveMessage(phoneNumber, message, buttons);
    
    res.json({
      success: result.success,
      message: result.success ? 'Daily tip sent successfully' : 'Failed to send daily tip',
      error: result.error
    });
  } catch (error) {
    console.error('Send daily tip error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send activity reminder
router.post('/send-activity-reminder', async (req, res) => {
  try {
    const { userId, phoneNumber, activityType, timeOfDay } = req.body;
    
    const reminder = ACTIVITY_REMINDERS.find(r => r.time === timeOfDay) || ACTIVITY_REMINDERS[0];
    
    const buttons = [
      {
        type: "reply",
        reply: {
          id: "activity_done",
          title: "✅ Done!"
        }
      },
      {
        type: "reply",
        reply: {
          id: "remind_later",
          title: "⏰ Remind me later"
        }
      },
      {
        type: "reply",
        reply: {
          id: "skip_today",
          title: "⏭️ Skip today"
        }
      }
    ];

    const result = await sendInteractiveMessage(phoneNumber, reminder.message, buttons);
    
    res.json({
      success: result.success,
      message: result.success ? 'Activity reminder sent successfully' : 'Failed to send reminder',
      error: result.error
    });
  } catch (error) {
    console.error('Send activity reminder error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send streak celebration
router.post('/send-streak-celebration', async (req, res) => {
  try {
    const { userId, phoneNumber, streakDays } = req.body;
    
    let message = STREAK_MESSAGES[0]; // default
    
    if (streakDays >= 30) message = STREAK_MESSAGES[4];
    else if (streakDays >= 21) message = STREAK_MESSAGES[3];
    else if (streakDays >= 14) message = STREAK_MESSAGES[2];
    else if (streakDays >= 7) message = STREAK_MESSAGES[1];
    else if (streakDays >= 3) message = STREAK_MESSAGES[0];

    const fullMessage = `${message}

Keep up the amazing work! Every day you choose health, you're investing in a brighter future. 🌟

Your consistency is inspiring other women in our community! 👥💜`;

    const result = await sendWhatsAppMessage(phoneNumber, fullMessage);
    
    res.json({
      success: result.success,
      message: result.success ? 'Streak celebration sent successfully' : 'Failed to send celebration',
      error: result.error
    });
  } catch (error) {
    console.error('Send streak celebration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Handle incoming WhatsApp messages (webhook)
router.post('/webhook', (req, res) => {
  try {
    const { entry } = req.body;
    
    if (entry && entry[0] && entry[0].changes && entry[0].changes[0]) {
      const change = entry[0].changes[0];
      
      if (change.field === 'messages' && change.value.messages) {
        const message = change.value.messages[0];
        const phoneNumber = message.from;
        const messageText = message.text?.body;
        const buttonReply = message.interactive?.button_reply?.id;
        
        console.log('Received WhatsApp message:', { phoneNumber, messageText, buttonReply });
        
        // Handle different types of responses
        if (buttonReply) {
          handleButtonResponse(phoneNumber, buttonReply);
        } else if (messageText) {
          handleTextMessage(phoneNumber, messageText);
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// Handle button responses
async function handleButtonResponse(phoneNumber, buttonId) {
  let responseMessage = '';
  
  switch (buttonId) {
    case 'yes_start':
      responseMessage = `🎉 Fantastic! Welcome to your health transformation journey!

I'll send you:
📅 Daily tips at 9 AM
🎯 Activity reminders at 2 PM  
💪 Weekly progress updates

Your first daily tip is coming tomorrow morning. Get ready to feel empowered about your health! 💜`;
      break;
      
    case 'activity_done':
      responseMessage = `🌟 Amazing job completing your activity! 

+10 points earned! 🎯
Your consistency is building powerful protective habits.

Keep up the incredible work - you're inspiring! 💪✨`;
      break;
      
    case 'remind_later':
      responseMessage = `⏰ No worries! I'll remind you in 2 hours. 

Remember: even 5 minutes of self-care makes a difference. Your health is worth it! 💜`;
      // TODO: Schedule reminder for 2 hours later
      break;
      
    case 'skip_today':
      responseMessage = `That's okay! Tomorrow is a fresh start. 🌅

Life happens, and one day doesn't define your journey. You've got this! 💪`;
      break;
      
    case 'tip_helpful':
      responseMessage = `❤️ So glad you found it helpful! 

Knowledge is power, especially when it comes to your health. Keep learning and growing! 🌱✨`;
      break;
      
    case 'learn_more':
      responseMessage = `📚 Want to dive deeper? 

Check out your personalized dashboard at: ${process.env.APP_URL}/dashboard

Your complete health report has detailed evidence-based recommendations tailored just for you! 📊💜`;
      break;
      
    default:
      responseMessage = `Thanks for your response! If you need help, just type "help" anytime. 💜`;
  }
  
  await sendWhatsAppMessage(phoneNumber, responseMessage);
}

// Handle text messages
async function handleTextMessage(phoneNumber, messageText) {
  const text = messageText.toLowerCase();
  let responseMessage = '';
  
  if (text.includes('help')) {
    responseMessage = `🆘 Here's how I can help:

📱 Daily health tips & motivation
🎯 Activity tracking & reminders
📊 Progress celebrations
❓ Answer health questions
🔗 Quick links to your dashboard

Just reply to my messages or type:
• "tip" - for today's health insight
• "progress" - for your stats
• "dashboard" - for full report link`;

  } else if (text.includes('tip')) {
    const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    responseMessage = `💡 *${tip.title}*\n\n${tip.content}`;
    
  } else if (text.includes('progress')) {
    responseMessage = `📊 Your Progress Summary:

🎯 Current streak: 5 days
⭐ Total points: 150
🏆 Level: Silver
📅 Activities completed: 12

You're doing amazing! Keep up the fantastic work! 💪✨`;

  } else if (text.includes('dashboard')) {
    responseMessage = `🔗 Access your full dashboard here:
${process.env.APP_URL}/dashboard

See your complete health analysis, personalized recommendations, and track your progress! 📊💜`;

  } else {
    responseMessage = `Thanks for reaching out! 💜

I'm here to support your breast health journey. For specific questions, I recommend checking your personalized dashboard or consulting with your healthcare provider.

Type "help" to see what I can assist you with! 🌟`;
  }
  
  await sendWhatsAppMessage(phoneNumber, responseMessage);
}

// Webhook verification (required by WhatsApp)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token';
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Weekly progress report
router.post('/send-weekly-report', async (req, res) => {
  try {
    const { userId, phoneNumber, weeklyStats } = req.body;
    
    const message = `📊 Your Weekly Health Report

🎯 Activities completed: ${weeklyStats.activitiesCompleted || 0}
⭐ Points earned: ${weeklyStats.pointsEarned || 0}
🔥 Streak maintained: ${weeklyStats.streakDays || 0} days
💪 Top category: ${weeklyStats.topCategory || 'Self-Care'}

${weeklyStats.motivationalMessage || "You're making incredible progress! Every healthy choice you make is an investment in your future. Keep up the amazing work! 🌟"}

Ready for another amazing week? 💜`;

    const result = await sendWhatsAppMessage(phoneNumber, message);
    
    res.json({
      success: result.success,
      message: result.success ? 'Weekly report sent successfully' : 'Failed to send report',
      error: result.error
    });
  } catch (error) {
    console.error('Send weekly report error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;