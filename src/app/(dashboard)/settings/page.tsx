'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface UserSettings {
  name: string;
  email: string;
  company: string;
  notifications: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Tech Corp',
    notifications: {
      email: true,
      push: true,
      weeklyReport: false,
    },
    theme: 'system',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Profile Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={settings.company}
                  onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  type="button"
                  id="email-notifications"
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: !settings.notifications.email,
                    },
                  })}
                  className={`${
                    settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="push-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications in browser
                  </p>
                </div>
                <button
                  type="button"
                  id="push-notifications"
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      push: !settings.notifications.push,
                    },
                  })}
                  className={`${
                    settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="weekly-report" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weekly Report
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive weekly activity report
                  </p>
                </div>
                <button
                  type="button"
                  id="weekly-report"
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      weeklyReport: !settings.notifications.weeklyReport,
                    },
                  })}
                  className={`${
                    settings.notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.notifications.weeklyReport ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Theme
            </h2>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme Preference
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as UserSettings['theme'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
