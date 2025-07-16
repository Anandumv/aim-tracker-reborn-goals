import { useState, useEffect } from 'react';

interface NotificationSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  lastShown: Date | null;
}

const NOTIFICATION_STORAGE_KEY = 'aim_notifications';

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    frequency: 'weekly',
    time: '09:00',
    lastShown: null,
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({
          ...parsed,
          lastShown: parsed.lastShown ? new Date(parsed.lastShown) : null,
        });
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }

    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const showNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (permission === 'granted' && settings.enabled) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      setSettings(prev => ({ ...prev, lastShown: new Date() }));
    }
  };

  const shouldShowReminder = (): boolean => {
    if (!settings.enabled || !settings.lastShown) return settings.enabled;

    const now = new Date();
    const lastShown = new Date(settings.lastShown);
    const diffInHours = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);

    switch (settings.frequency) {
      case 'daily':
        return diffInHours >= 24;
      case 'weekly':
        return diffInHours >= 168; // 7 days
      case 'monthly':
        return diffInHours >= 720; // 30 days
      default:
        return false;
    }
  };

  const sendGoalReminder = (goalCount: number, completedToday: number) => {
    if (!shouldShowReminder()) return;

    const messages = [
      `You have ${goalCount} active goals. How's your progress today?`,
      `Time to check in on your goals! ${completedToday} updated today.`,
      `Your goals are waiting! Quick check-in?`,
      `Making progress is a daily choice. Update your goals!`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification('Goal Check-in', randomMessage);
  };

  return {
    settings,
    permission,
    requestPermission,
    updateSettings,
    showNotification,
    shouldShowReminder,
    sendGoalReminder,
  };
}