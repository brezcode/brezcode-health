import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// OneSignal configuration (you'll need to set these environment variables)
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || 'your-app-id-here';
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || 'your-rest-api-key-here';

// Send immediate push notification
router.post('/send', async (req, res) => {
  try {
    const { title, message, url, userIds } = req.body;
    
    const notification = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      url: url || '/dashboard',
      include_subscription_ids: userIds || undefined,
      included_segments: userIds ? undefined : ['All']
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(notification)
    });

    const result = await response.json();
    
    if (response.ok) {
      res.json({ ok: true, notificationId: result.id });
    } else {
      res.status(400).json({ ok: false, message: result.errors || 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Push notification error:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// Schedule daily health reminders
router.post('/schedule-daily', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    if (!userId || !preferences) {
      return res.status(400).json({ ok: false, message: 'User ID and preferences required' });
    }

    const dailyNotifications = [];

    // Morning reminder
    if (preferences.morningReminders) {
      dailyNotifications.push({
        app_id: ONESIGNAL_APP_ID,
        headings: { en: "🌅 Morning Wellness Time!" },
        contents: { en: "Start your day with a breast massage and healthy breakfast. Your body will thank you!" },
        url: "/dashboard?tab=plan&period=morning",
        send_after: calculateNextTime(preferences.reminderTimes.morning),
        filters: [
          { field: "tag", key: "user_id", relation: "=", value: userId }
        ]
      });
    }

    // Afternoon reminder  
    if (preferences.afternoonReminders) {
      dailyNotifications.push({
        app_id: ONESIGNAL_APP_ID,
        headings: { en: "☀️ Midday Movement Time!" },
        contents: { en: "Perfect time for your walk and green tea break. Keep the momentum going!" },
        url: "/dashboard?tab=plan&period=afternoon",
        send_after: calculateNextTime(preferences.reminderTimes.afternoon),
        filters: [
          { field: "tag", key: "user_id", relation: "=", value: userId }
        ]
      });
    }

    // Evening reminder
    if (preferences.eveningReminders) {
      dailyNotifications.push({
        app_id: ONESIGNAL_APP_ID, 
        headings: { en: "🌙 Evening Self-Care!" },
        contents: { en: "Wind down with supplements and breathing exercises. You're doing great!" },
        url: "/dashboard?tab=plan&period=evening",
        send_after: calculateNextTime(preferences.reminderTimes.evening),
        filters: [
          { field: "tag", key: "user_id", relation: "=", value: userId }
        ]
      });
    }

    // Schedule each notification
    const results = [];
    for (const notification of dailyNotifications) {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(notification)
      });

      const result = await response.json();
      results.push(result);
    }

    res.json({ 
      ok: true, 
      scheduled: results.length,
      notificationIds: results.map(r => r.id)
    });

  } catch (error) {
    console.error('Schedule daily notifications error:', error);
    res.status(500).json({ ok: false, message: 'Failed to schedule notifications' });
  }
});

// Calculate next occurrence of time today/tomorrow
function calculateNextTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  return targetTime.toISOString();
}

// Get notification history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real app, you'd fetch from your database
    // For now, return mock data
    const mockHistory = [
      {
        id: '1',
        title: '🌅 Morning Wellness Time!',
        message: 'Start your day with a breast massage and healthy breakfast.',
        sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        opened: true
      },
      {
        id: '2', 
        title: '☀️ Midday Movement Time!',
        message: 'Perfect time for your walk and green tea break.',
        sent_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // Yesterday afternoon
        opened: false
      }
    ];

    res.json({ ok: true, notifications: mockHistory });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to fetch history' });
  }
});

export default router;