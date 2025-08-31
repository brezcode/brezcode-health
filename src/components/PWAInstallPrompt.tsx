import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detect if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after user has been using the app for a bit
      setTimeout(() => {
        if (!standalone) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show install instructions after delay
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 45000); // Show iOS instructions after 45 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ PWA install accepted');
      } else {
        console.log('❌ PWA install dismissed');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('❌ PWA install failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  if (isStandalone) return null;
  
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Install BrezCode Health</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Get daily health reminders and access your wellness plan offline!
        </p>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-blue-700">To install on iPhone:</p>
            <ol className="text-xs text-gray-600 space-y-1 ml-4">
              <li>1. Tap the Share button in Safari</li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" to install the app</li>
            </ol>
            <Button variant="outline" size="sm" onClick={handleDismiss} className="w-full">
              Got it!
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔔 Push notifications</span>
            <span>📱 Offline access</span>
            <span>⚡ Faster loading</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}