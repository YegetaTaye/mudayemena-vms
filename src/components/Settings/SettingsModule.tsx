import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import SystemSettings from './SystemSettings';
import UserPreferences from './UserPreferences';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import BackupSettings from './BackupSettings';
import IntegrationSettings from './IntegrationSettings';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Plug,
  Palette,
  Globe
} from 'lucide-react';

type View = 'system' | 'preferences' | 'security' | 'notifications' | 'backup' | 'integrations';

const SettingsModule: React.FC = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<View>('system');
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  const showToast = (type: typeof toast.type, message: string) => {
    setToast({ type, message, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const getTitle = () => {
    switch (currentView) {
      case 'system':
        return 'System Settings';
      case 'preferences':
        return 'User Preferences';
      case 'security':
        return 'Security Settings';
      case 'notifications':
        return 'Notification Settings';
      case 'backup':
        return 'Backup & Recovery';
      case 'integrations':
        return 'Integrations';
      default:
        return 'Settings';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'system':
        return 'Configure system-wide settings and preferences';
      case 'preferences':
        return 'Customize your personal experience';
      case 'security':
        return 'Manage security policies and access controls';
      case 'notifications':
        return 'Configure alerts and notification preferences';
      case 'backup':
        return 'Manage data backup and recovery options';
      case 'integrations':
        return 'Connect with external systems and services';
      default:
        return 'System configuration and preferences';
    }
  };

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentView('system')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'system'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>System</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'preferences'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Preferences</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'security'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'notifications'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('backup')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'backup'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Backup</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('integrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'integrations'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plug className="h-4 w-4" />
              <span>Integrations</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {currentView === 'system' && (
        <SystemSettings onShowToast={showToast} />
      )}

      {currentView === 'preferences' && (
        <UserPreferences onShowToast={showToast} />
      )}

      {currentView === 'security' && (
        <SecuritySettings onShowToast={showToast} />
      )}

      {currentView === 'notifications' && (
        <NotificationSettings onShowToast={showToast} />
      )}

      {currentView === 'backup' && (
        <BackupSettings onShowToast={showToast} />
      )}

      {currentView === 'integrations' && (
        <IntegrationSettings onShowToast={showToast} />
      )}

      {/* Toast Notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default SettingsModule;