import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Save, 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  VolumeX,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  FileText,
  Truck,
  Users,
  Stethoscope,
  Shield
} from 'lucide-react';

interface NotificationSettingsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onShowToast }) => {
  const [notifications, setNotifications] = useState({
    // Global Settings
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    soundEnabled: true,
    
    // Timing
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    
    // Frequency
    digestFrequency: 'daily',
    batchNotifications: true,
    
    // Module-specific notifications
    inventory: {
      lowStock: true,
      expiringSoon: true,
      stockOut: true,
      reorderAlerts: true,
      priceChanges: false
    },
    grn: {
      newGRN: true,
      approvalRequired: true,
      approved: true,
      rejected: false
    },
    delivery: {
      newDelivery: true,
      statusUpdates: true,
      delivered: true,
      delayed: true
    },
    consultations: {
      newAppointment: true,
      appointmentReminder: true,
      cancelled: true,
      followUpDue: true
    },
    users: {
      newUser: true,
      roleChanges: true,
      loginAlerts: true,
      securityAlerts: true
    },
    system: {
      backupComplete: false,
      backupFailed: true,
      systemUpdates: true,
      maintenanceMode: true,
      errorAlerts: true
    }
  });

  const handleSave = () => {
    onShowToast('success', 'Notification settings saved successfully');
  };

  const handleTestNotification = (type: string) => {
    onShowToast('info', `Test ${type} notification sent`);
  };

  const toggleModuleNotifications = (module: string, enabled: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [module]: Object.keys(prev[module as keyof typeof prev] as object).reduce((acc, key) => ({
        ...acc,
        [key]: enabled
      }), {})
    }));
  };

  const notificationChannels = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      description: 'Receive notifications via email',
      enabled: notifications.emailEnabled,
      toggle: (enabled: boolean) => setNotifications(prev => ({ ...prev, emailEnabled: enabled }))
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: Smartphone,
      description: 'Browser push notifications',
      enabled: notifications.pushEnabled,
      toggle: (enabled: boolean) => setNotifications(prev => ({ ...prev, pushEnabled: enabled }))
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: Smartphone,
      description: 'Text message notifications',
      enabled: notifications.smsEnabled,
      toggle: (enabled: boolean) => setNotifications(prev => ({ ...prev, smsEnabled: enabled }))
    },
    {
      id: 'sound',
      name: 'Sound',
      icon: Volume2,
      description: 'Play notification sounds',
      enabled: notifications.soundEnabled,
      toggle: (enabled: boolean) => setNotifications(prev => ({ ...prev, soundEnabled: enabled }))
    }
  ];

  const moduleSettings = [
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      settings: notifications.inventory,
      labels: {
        lowStock: 'Low stock alerts',
        expiringSoon: 'Items expiring soon',
        stockOut: 'Out of stock alerts',
        reorderAlerts: 'Reorder notifications',
        priceChanges: 'Price change alerts'
      }
    },
    {
      id: 'grn',
      name: 'GRN Management',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      settings: notifications.grn,
      labels: {
        newGRN: 'New GRN created',
        approvalRequired: 'Approval required',
        approved: 'GRN approved',
        rejected: 'GRN rejected'
      }
    },
    {
      id: 'delivery',
      name: 'Delivery Management',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      settings: notifications.delivery,
      labels: {
        newDelivery: 'New delivery created',
        statusUpdates: 'Status updates',
        delivered: 'Delivery completed',
        delayed: 'Delivery delayed'
      }
    },
    {
      id: 'consultations',
      name: 'Consultations',
      icon: Stethoscope,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      settings: notifications.consultations,
      labels: {
        newAppointment: 'New appointment',
        appointmentReminder: 'Appointment reminders',
        cancelled: 'Appointment cancelled',
        followUpDue: 'Follow-up due'
      }
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      settings: notifications.users,
      labels: {
        newUser: 'New user registered',
        roleChanges: 'Role changes',
        loginAlerts: 'Login notifications',
        securityAlerts: 'Security alerts'
      }
    },
    {
      id: 'system',
      name: 'System Alerts',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      settings: notifications.system,
      labels: {
        backupComplete: 'Backup completed',
        backupFailed: 'Backup failed',
        systemUpdates: 'System updates',
        maintenanceMode: 'Maintenance mode',
        errorAlerts: 'Error alerts'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${channel.enabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-5 w-5 ${channel.enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{channel.name}</p>
                    <p className="text-xs text-gray-500">{channel.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleTestNotification(channel.name)}
                  >
                    Test
                  </Button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.enabled}
                      onChange={(e) => channel.toggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Timing Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timing & Frequency</h3>
        <div className="space-y-6">
          {/* Quiet Hours */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Quiet Hours</h4>
                <p className="text-xs text-gray-500">Suppress non-urgent notifications during these hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.quietHoursEnabled}
                  onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            {notifications.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={notifications.quietHoursStart}
                    onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={notifications.quietHoursEnd}
                    onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Other Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Digest Frequency</label>
              <select
                value={notifications.digestFrequency}
                onChange={(e) => setNotifications(prev => ({ ...prev, digestFrequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notifications.batchNotifications}
                  onChange={(e) => setNotifications(prev => ({ ...prev, batchNotifications: e.target.checked }))}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Batch similar notifications</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Module-specific Settings */}
      {moduleSettings.map((module) => {
        const Icon = module.icon;
        const moduleNotifications = module.settings as Record<string, boolean>;
        const allEnabled = Object.values(moduleNotifications).every(Boolean);
        const someEnabled = Object.values(moduleNotifications).some(Boolean);
        
        return (
          <Card key={module.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${module.bgColor}`}>
                  <Icon className={`h-5 w-5 ${module.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => toggleModuleNotifications(module.id, !allEnabled)}
                >
                  {allEnabled ? 'Disable All' : 'Enable All'}
                </Button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allEnabled}
                    ref={(input) => {
                      if (input) input.indeterminate = someEnabled && !allEnabled;
                    }}
                    onChange={(e) => toggleModuleNotifications(module.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(moduleNotifications).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{module.labels[key as keyof typeof module.labels]}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        [module.id]: {
                          ...prev[module.id as keyof typeof prev] as object,
                          [key]: e.target.checked
                        }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSave} icon={Save}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;