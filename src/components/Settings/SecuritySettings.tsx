import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Save, 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Globe,
  UserX,
  RefreshCw
} from 'lucide-react';

interface SecuritySettingsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onShowToast }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    ipWhitelist: '',
    allowMultipleSessions: true,
    requirePasswordChange: false,
    lockoutThreshold: 5,
    lockoutDuration: 15
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      onShowToast('error', 'New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      onShowToast('error', 'Password must be at least 8 characters long');
      return;
    }
    onShowToast('success', 'Password changed successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEnable2FA = () => {
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    onShowToast('success', securitySettings.twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
  };

  const handleSaveSettings = () => {
    onShowToast('success', 'Security settings saved successfully');
  };

  const handleRevokeAllSessions = () => {
    if (confirm('This will log you out of all devices. Continue?')) {
      onShowToast('success', 'All sessions revoked successfully');
    }
  };

  // Mock active sessions
  const activeSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      lastActive: '2024-01-21T10:30:00Z',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      ipAddress: '192.168.1.101',
      lastActive: '2024-01-21T08:15:00Z',
      current: false
    },
    {
      id: '3',
      device: 'Firefox on MacOS',
      location: 'Boston, MA',
      ipAddress: '10.0.0.50',
      lastActive: '2024-01-20T16:45:00Z',
      current: false
    }
  ];

  // Mock login history
  const loginHistory = [
    {
      id: '1',
      timestamp: '2024-01-21T10:30:00Z',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-21T08:15:00Z',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      ipAddress: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-01-20T22:30:00Z',
      device: 'Unknown Browser',
      location: 'Unknown Location',
      ipAddress: '203.0.113.1',
      status: 'failed'
    },
    {
      id: '4',
      timestamp: '2024-01-20T16:45:00Z',
      device: 'Firefox on MacOS',
      location: 'Boston, MA',
      ipAddress: '10.0.0.50',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>At least 8 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contains uppercase and lowercase letters</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contains at least one number</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contains at least one special character</span>
              </li>
            </ul>
          </div>
          
          <Button onClick={handlePasswordChange} icon={Key}>
            Change Password
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${securitySettings.twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Shield className={`h-6 w-6 ${securitySettings.twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {securitySettings.twoFactorEnabled 
                    ? 'Your account is protected with two-factor authentication.'
                    : 'Add an extra layer of security to your account.'
                  }
                </p>
              </div>
              <Button 
                onClick={handleEnable2FA} 
                variant={securitySettings.twoFactorEnabled ? 'danger' : 'primary'}
                size="sm"
              >
                {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
            
            {securitySettings.twoFactorEnabled && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Authenticator app configured</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Backup codes: 8 remaining
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Policies</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="5"
                max="480"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
              <input
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="30"
                max="365"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Threshold</label>
              <input
                type="number"
                value={securitySettings.lockoutThreshold}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockoutThreshold: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="3"
                max="10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Whitelist</label>
            <textarea
              value={securitySettings.ipWhitelist}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter IP addresses or ranges, one per line (e.g., 192.168.1.0/24)"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to allow access from any IP address</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Login Notifications</p>
                <p className="text-xs text-gray-500">Get notified of new login attempts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.loginNotifications}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Allow Multiple Sessions</p>
                <p className="text-xs text-gray-500">Allow login from multiple devices simultaneously</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.allowMultipleSessions}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowMultipleSessions: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Require Password Change</p>
                <p className="text-xs text-gray-500">Force password change on next login</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.requirePasswordChange}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, requirePasswordChange: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
          <Button variant="danger" size="sm" onClick={handleRevokeAllSessions} icon={UserX}>
            Revoke All Sessions
          </Button>
        </div>
        
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${session.current ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Smartphone className={`h-4 w-4 ${session.current ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session.device} {session.current && <span className="text-green-600">(Current)</span>}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.location} • {session.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {!session.current && (
                <Button variant="danger" size="sm" icon={UserX}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Login History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login Activity</h3>
        <div className="space-y-3">
          {loginHistory.map((login) => (
            <div key={login.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${login.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {login.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {login.status === 'success' ? 'Successful login' : 'Failed login attempt'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {login.device} • {login.location} • {login.ipAddress}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(login.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} icon={Save}>
          Save Security Settings
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;