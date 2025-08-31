import OneSignal from 'react-onesignal';

interface DailySchedule {
  morning: { time: string; message: string; url: string }[];
  afternoon: { time: string; message: string; url: string }[];
  evening: { time: string; message: string; url: string }[];
}

interface UserNotificationPreferences {
  morningReminders: boolean;
  afternoonReminders: boolean;
  eveningReminders: boolean;
  reminderTimes: {
    morning: string; // "08:00"
    afternoon: string; // "14:00" 
    evening: string; // "20:00"
  };
  timezone: string;
}

export class PushNotificationScheduler {
  private oneSignalAppId: string;
  private isInitialized: boolean = false;

  constructor(appId: string) {
    this.oneSignalAppId = appId;
  }

  // Initialize OneSignal
  async initialize(): Promise<boolean> {
    try {
      await OneSignal.init({
        appId: this.oneSignalAppId,
        safari_web_id: "web.onesignal.auto.afbc7dfd-3c15-4936-82b3-b90377c7de7d", // You'll need to get this
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
        autoResubscribe: true,
        autoRegister: true,
        welcomeNotification: {
          title: "Welcome to BrezCode Health!",
          message: "You'll receive personalized daily health reminders to support your wellness journey."
        }
      });

      this.isInitialized = true;
      console.log('✅ OneSignal initialized successfully');
      
      // Request permission immediately
      await this.requestPermission();
      
      return true;
    } catch (error) {
      console.error('❌ OneSignal initialization failed:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await OneSignal.Notifications.requestPermission();
      console.log('🔔 Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('❌ Permission request failed:', error);
      return false;
    }
  }

  // Set up daily health reminders
  async scheduleDailyReminders(userPreferences: UserNotificationPreferences): Promise<void> {
    if (!this.isInitialized) {
      console.error('❌ OneSignal not initialized');
      return;
    }

    try {
      // Set user timezone
      await OneSignal.User.addAlias('timezone', userPreferences.timezone);

      const schedule: DailySchedule = {
        morning: [
          {
            time: userPreferences.reminderTimes.morning,
            message: "🌅 Good morning! Start your day with a 5-minute breast massage and Mediterranean breakfast.",
            url: "/dashboard?tab=plan&period=morning"
          }
        ],
        afternoon: [
          {
            time: userPreferences.reminderTimes.afternoon, 
            message: "☀️ Afternoon check-in! Time for your brisk walk and green tea break.",
            url: "/dashboard?tab=plan&period=afternoon"
          }
        ],
        evening: [
          {
            time: userPreferences.reminderTimes.evening,
            message: "🌙 Evening wellness time! Don't forget your supplements and breathing exercise.",
            url: "/dashboard?tab=plan&period=evening"
          }
        ]
      };

      // Schedule each notification
      for (const [period, notifications] of Object.entries(schedule)) {
        if (!userPreferences[`${period}Reminders` as keyof UserNotificationPreferences]) {
          continue;
        }

        for (const notification of notifications) {
          await this.scheduleRepeatingNotification(
            `daily-${period}`,
            notification.message,
            notification.time,
            notification.url
          );
        }
      }

      console.log('✅ Daily reminders scheduled successfully');
    } catch (error) {
      console.error('❌ Failed to schedule reminders:', error);
    }
  }

  // Schedule a repeating daily notification
  private async scheduleRepeatingNotification(
    id: string,
    message: string, 
    time: string, // "HH:MM" format
    url: string
  ): Promise<void> {
    try {
      // Calculate seconds until target time today
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      // If target time has passed today, schedule for tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const secondsUntilTarget = Math.floor((targetTime.getTime() - now.getTime()) / 1000);

      // Use OneSignal API to schedule notification
      await OneSignal.Notifications.requestPermission();
      
      // Store the scheduled notification info for later API calls
      localStorage.setItem(`scheduled-${id}`, JSON.stringify({
        message,
        time,
        url,
        nextTrigger: targetTime.toISOString()
      }));

      console.log(`📅 Scheduled ${id} for ${time} (in ${Math.round(secondsUntilTarget/3600)}h)`);
    } catch (error) {
      console.error(`❌ Failed to schedule ${id}:`, error);
    }
  }

  // Send immediate notification
  async sendNotification(title: string, message: string, url?: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('❌ OneSignal not initialized');
      return;
    }

    try {
      // For immediate notifications, we'll trigger them through the backend
      // since client-side can't send push notifications to itself
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          url: url || '/dashboard'
        })
      });

      if (response.ok) {
        console.log('✅ Notification sent successfully');
      } else {
        console.error('❌ Failed to send notification');
      }
    } catch (error) {
      console.error('❌ Notification send failed:', error);
    }
  }

  // Get user's push subscription status
  async getSubscriptionStatus(): Promise<{subscribed: boolean, userId?: string}> {
    try {
      const subscribed = await OneSignal.Notifications.permission;
      const userId = await OneSignal.User.PushSubscription.id;
      
      return {
        subscribed: subscribed === 'granted',
        userId: userId || undefined
      };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return { subscribed: false };
    }
  }

  // Update user preferences
  async updatePreferences(preferences: UserNotificationPreferences): Promise<void> {
    try {
      // Store preferences locally
      localStorage.setItem('notification-preferences', JSON.stringify(preferences));
      
      // Update OneSignal tags for targeting
      await OneSignal.User.addTags({
        morning_reminders: preferences.morningReminders.toString(),
        afternoon_reminders: preferences.afternoonReminders.toString(),
        evening_reminders: preferences.eveningReminders.toString(),
        morning_time: preferences.reminderTimes.morning,
        afternoon_time: preferences.reminderTimes.afternoon,
        evening_time: preferences.reminderTimes.evening,
        timezone: preferences.timezone
      });

      console.log('✅ Notification preferences updated');
    } catch (error) {
      console.error('❌ Failed to update preferences:', error);
    }
  }
}

// Default notification preferences
export const defaultNotificationPreferences: UserNotificationPreferences = {
  morningReminders: true,
  afternoonReminders: true,
  eveningReminders: true,
  reminderTimes: {
    morning: "08:00",
    afternoon: "14:00", 
    evening: "20:00"
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

// Daily reminder messages for variety
export const dailyReminderMessages = {
  morning: [
    "🌅 Good morning! Start your wellness journey with today's activities.",
    "☕ Rise and shine! Your personalized health plan is waiting.",
    "🌸 New day, new opportunity for self-care. Check your morning routine!",
    "💪 Morning motivation: Every small step counts toward better health!",
    "🧘‍♀️ Begin your day mindfully with your wellness activities."
  ],
  afternoon: [
    "☀️ Afternoon check-in! How's your daily plan going?",
    "🚶‍♀️ Perfect time for your afternoon movement activity!",
    "🍃 Midday wellness moment - complete your next health activity.",
    "⚡ Energy boost time! Check off your afternoon wellness goals.",
    "🎯 Halfway through the day - you're doing great! Keep it up."
  ],
  evening: [
    "🌙 Evening wind-down time. Complete your final wellness activities.",
    "✨ End your day on a healthy note with your evening routine.",
    "🛌 Before bed self-care time - you deserve this moment of wellness.",
    "💜 Evening reflection: celebrate today's health wins!",
    "🌟 Close out your day with mindful wellness activities."
  ]
};

// Create singleton instance (app will provide OneSignal App ID)
export let pushScheduler: PushNotificationScheduler;

export function initializePushScheduler(appId: string): PushNotificationScheduler {
  pushScheduler = new PushNotificationScheduler(appId);
  return pushScheduler;
}