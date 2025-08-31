import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Bell, 
  Smartphone, 
  Settings, 
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Users
} from 'lucide-react';
import { PushNotificationScheduler, defaultNotificationPreferences, dailyReminderMessages } from '../services/pushNotificationScheduler';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'whatsapp' | 'push' | 'ios';
  enabled: boolean;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
}

interface NotificationPreference {
  category: string;
  whatsapp: boolean;
  push: boolean;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface Props {
  userId: string;
  userProfile: {
    phone?: string;
    timezone?: string;
    preferences?: any;
  };
}

export default function NotificationManager({ userId, userProfile }: Props) {
  const [pushScheduler, setPushScheduler] = useState<PushNotificationScheduler | null>(null);
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Coaching',
      type: 'whatsapp',
      enabled: false,
      description: 'Daily motivation, reminders, and expert tips',
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
      status: 'disconnected'
    },
    {
      id: 'push',
      name: 'Web Push Notifications',
      type: 'push',
      enabled: false,
      description: 'Browser notifications for activities and reminders',
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      status: 'disconnected'
    },
    {
      id: 'ios',
      name: 'iOS Home Screen App',
      type: 'ios',
      enabled: false,
      description: 'Add to home screen for native app experience',
      icon: <Smartphone className="h-5 w-5 text-gray-600" />,
      status: 'disconnected'
    }
  ]);

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      category: 'Daily Health Tips',
      whatsapp: true,
      push: false,
      time: '09:00',
      frequency: 'daily'
    },
    {
      category: 'Activity Reminders',
      whatsapp: true,
      push: true,
      time: '14:00',
      frequency: 'daily'
    },
    {
      category: 'BSE Reminders',
      whatsapp: true,
      push: false,
      time: '10:00',
      frequency: 'monthly'
    },
    {
      category: 'Weekly Progress',
      whatsapp: true,
      push: false,
      time: '18:00',
      frequency: 'weekly'
    }
  ]);

  const [phoneNumber, setPhoneNumber] = useState(userProfile.phone || '');
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect if running on iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  // Check if user can install PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Initialize OneSignal push notifications
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        // You'll need to replace this with your actual OneSignal App ID
        const ONESIGNAL_APP_ID = 'your-onesignal-app-id-here';
        
        const scheduler = new PushNotificationScheduler(ONESIGNAL_APP_ID);
        const initialized = await scheduler.initialize();
        
        if (initialized) {
          setPushScheduler(scheduler);
          
          // Update push channel status
          setChannels(prev => prev.map(channel => 
            channel.id === 'push' 
              ? { ...channel, status: 'connected', enabled: true }
              : channel
          ));

          // Schedule daily reminders with user's preferences
          await scheduler.scheduleDailyReminders(defaultNotificationPreferences);
          
          console.log('✅ Push notifications initialized and scheduled');
        }
      } catch (error) {
        console.error('❌ Push notification initialization failed:', error);
        
        // Update push channel status to show error
        setChannels(prev => prev.map(channel => 
          channel.id === 'push' 
            ? { ...channel, status: 'disconnected' }
            : channel
        ));
      }
    };

    initializePushNotifications();
  }, []);

  // Initialize OneSignal
  const initializeOneSignal = async () => {
    try {
      setLoading(true);
      
      // Initialize OneSignal (replace with your app ID)
      const OneSignal = (window as any).OneSignal;
      if (OneSignal) {
        await OneSignal.init({
          appId: "YOUR_ONESIGNAL_APP_ID", // Replace with actual app ID
        });

        // Request permission
        const permission = await OneSignal.showNativePrompt();
        if (permission) {
          updateChannelStatus('push', 'connected');
          
          // Set user tags for personalization
          OneSignal.sendTags({
            user_id: userId,
            life_stage: userProfile.preferences?.lifeStage || 'unknown',
            risk_level: userProfile.preferences?.riskLevel || 'unknown'
          });
        }
      }
    } catch (error) {
      console.error('OneSignal initialization failed:', error);
      updateChannelStatus('push', 'disconnected');
    } finally {
      setLoading(false);
    }
  };

  // Setup WhatsApp notifications
  const setupWhatsApp = async () => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      
      // Send WhatsApp opt-in message
      const response = await fetch('/api/whatsapp/opt-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
          preferences: preferences.filter(p => p.whatsapp)
        }),
      });

      if (response.ok) {
        updateChannelStatus('whatsapp', 'pending');
        alert('WhatsApp setup message sent! Please respond to the message to complete setup.');
      } else {
        throw new Error('Failed to setup WhatsApp');
      }
    } catch (error) {
      console.error('WhatsApp setup failed:', error);
      alert('Failed to setup WhatsApp notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Install PWA
  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        updateChannelStatus('ios', 'connected');
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS()) {
      // Show iOS-specific install instructions
      setShowSetup(true);
    }
  };

  // Update channel status
  const updateChannelStatus = (channelId: string, status: 'connected' | 'disconnected' | 'pending') => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, status, enabled: status === 'connected' }
        : channel
    ));
  };

  // Toggle preference
  const togglePreference = (index: number, type: 'whatsapp' | 'push') => {
    setPreferences(prev => prev.map((pref, i) => 
      i === index ? { ...pref, [type]: !pref[type] } : pref
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Channel Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-600" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Connect your preferred channels for personalized breast health coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{channel.name}</h3>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(channel.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(channel.status)}
                      <span className="capitalize">{channel.status}</span>
                    </div>
                  </Badge>
                  {channel.status === 'disconnected' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (channel.type === 'whatsapp') setShowSetup(true);
                        else if (channel.type === 'push') initializeOneSignal();
                        else if (channel.type === 'ios') installPWA();
                      }}
                      disabled={loading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Setup Modal */}
      {showSetup && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <MessageSquare className="h-5 w-5 mr-2" />
              WhatsApp Setup
            </CardTitle>
            <CardDescription>
              Enter your phone number to receive personalized health coaching via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: +1 for US, +44 for UK, +91 for India
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What you'll receive:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Daily breast health tips and motivation</li>
                  <li>• Personalized activity reminders</li>
                  <li>• Monthly BSE reminders</li>
                  <li>• Weekly progress celebrations</li>
                  <li>• Emergency support when needed</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={setupWhatsApp}
                  disabled={!phoneNumber || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Setting up...' : 'Setup WhatsApp'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSetup(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* iOS Install Instructions */}
      {isIOS() && showSetup && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Smartphone className="h-5 w-5 mr-2" />
              Add to iPhone Home Screen
            </CardTitle>
            <CardDescription>
              Get the native app experience with offline access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Instructions:</h4>
                <ol className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                    Tap the Share button (box with arrow) in Safari
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                    Scroll down and tap "Add to Home Screen"
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                    Tap "Add" to install the app
                  </li>
                </ol>
              </div>
              <Button
                onClick={() => setShowSetup(false)}
                className="w-full"
              >
                Got it!
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-purple-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize when and how you receive health reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preferences.map((pref, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{pref.category}</h3>
                  <Badge variant="outline">{pref.frequency}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm">WhatsApp</span>
                    </div>
                    <button
                      onClick={() => togglePreference(index, 'whatsapp')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        pref.whatsapp ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          pref.whatsapp ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Push</span>
                    </div>
                    <button
                      onClick={() => togglePreference(index, 'push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        pref.push ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          pref.push ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <span>Time: {pref.time}</span>
                  <span>•</span>
                  <span className="capitalize">{pref.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Features Preview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Community Features (Coming Soon)
          </CardTitle>
          <CardDescription>
            Connect with other women on similar health journeys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">WhatsApp Groups</h3>
              <p className="text-sm text-gray-600">Join age-specific support groups for shared experiences and motivation</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Weekly Challenges</h3>
              <p className="text-sm text-gray-600">Participate in community wellness challenges with leaderboards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}