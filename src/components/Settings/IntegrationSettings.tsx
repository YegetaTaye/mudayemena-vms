import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Save, 
  Plus, 
  Settings, 
  Check, 
  X, 
  ExternalLink,
  Key,
  Globe,
  Database,
  Mail,
  MessageSquare,
  Smartphone,
  Cloud,
  Shield,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface IntegrationSettingsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ onShowToast }) => {
  const [integrations, setIntegrations] = useState({
    // Email Services
    smtp: {
      enabled: false,
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls'
    },
    
    // Cloud Storage
    cloudStorage: {
      enabled: false,
      provider: 'aws',
      accessKey: '',
      secretKey: '',
      bucket: '',
      region: 'us-east-1'
    },
    
    // SMS Services
    sms: {
      enabled: false,
      provider: 'twilio',
      accountSid: '',
      authToken: '',
      fromNumber: ''
    },
    
    // External APIs
    weatherApi: {
      enabled: false,
      apiKey: '',
      provider: 'openweather'
    },
    
    // Payment Processing
    stripe: {
      enabled: false,
      publishableKey: '',
      secretKey: '',
      webhookSecret: ''
    },
    
    // Analytics
    analytics: {
      enabled: false,
      trackingId: '',
      provider: 'google'
    }
  });

  const handleSave = () => {
    onShowToast('success', 'Integration settings saved successfully');
  };

  const handleTestConnection = (integration: string) => {
    onShowToast('info', `Testing ${integration} connection...`);
    // Simulate test
    setTimeout(() => {
      onShowToast('success', `${integration} connection test successful`);
    }, 2000);
  };

  const handleToggleIntegration = (integration: string, enabled: boolean) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        enabled
      }
    }));
    
    if (enabled) {
      onShowToast('success', `${integration} integration enabled`);
    } else {
      onShowToast('warning', `${integration} integration disabled`);
    }
  };

  const availableIntegrations = [
    {
      id: 'smtp',
      name: 'Email (SMTP)',
      description: 'Send emails for notifications and reports',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      status: integrations.smtp.enabled ? 'connected' : 'disconnected'
    },
    {
      id: 'cloudStorage',
      name: 'Cloud Storage',
      description: 'Store backups and files in the cloud',
      icon: Cloud,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      status: integrations.cloudStorage.enabled ? 'connected' : 'disconnected'
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      description: 'Send SMS alerts and notifications',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      status: integrations.sms.enabled ? 'connected' : 'disconnected'
    },
    {
      id: 'stripe',
      name: 'Payment Processing',
      description: 'Accept payments and manage billing',
      icon: Zap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      status: integrations.stripe.enabled ? 'connected' : 'disconnected'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Track usage and generate insights',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      status: integrations.analytics.enabled ? 'connected' : 'disconnected'
    },
    {
      id: 'weatherApi',
      name: 'Weather API',
      description: 'Get weather data for location-based features',
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      status: integrations.weatherApi.enabled ? 'connected' : 'disconnected'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
        return <X className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <X className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Overview</h3>
        <p className="text-gray-600 mb-6">
          Connect VetPharm Pro with external services to extend functionality and automate workflows.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-800">
              {availableIntegrations.filter(i => i.status === 'connected').length}
            </p>
            <p className="text-sm text-green-600">Active Integrations</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-800">
              {availableIntegrations.length}
            </p>
            <p className="text-sm text-gray-600">Available Integrations</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-800">Secure</p>
            <p className="text-sm text-blue-600">All connections encrypted</p>
          </div>
        </div>
      </Card>

      {/* Available Integrations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIntegrations.map((integration) => {
            const Icon = integration.icon;
            const isEnabled = integration.status === 'connected';
            
            return (
              <div key={integration.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${integration.bgColor}`}>
                      <Icon className={`h-6 w-6 ${integration.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{integration.description}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          <span className="capitalize">{integration.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isEnabled && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleTestConnection(integration.name)}
                        icon={RefreshCw}
                      >
                        Test
                      </Button>
                    )}
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => handleToggleIntegration(integration.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* SMTP Configuration */}
      {integrations.smtp.enabled && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email (SMTP) Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={integrations.smtp.host}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, host: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="number"
                value={integrations.smtp.port}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, port: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={integrations.smtp.username}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, username: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="your-email@domain.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={integrations.smtp.password}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, password: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Cloud Storage Configuration */}
      {integrations.cloudStorage.enabled && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cloud Storage Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <select
                value={integrations.cloudStorage.provider}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  cloudStorage: { ...prev.cloudStorage, provider: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="aws">Amazon S3</option>
                <option value="gcp">Google Cloud Storage</option>
                <option value="azure">Azure Blob Storage</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input
                type="text"
                value={integrations.cloudStorage.region}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  cloudStorage: { ...prev.cloudStorage, region: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="us-east-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Key</label>
              <input
                type="text"
                value={integrations.cloudStorage.accessKey}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  cloudStorage: { ...prev.cloudStorage, accessKey: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Your access key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="password"
                value={integrations.cloudStorage.secretKey}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  cloudStorage: { ...prev.cloudStorage, secretKey: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Integration Marketplace */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Marketplace</h3>
        <p className="text-gray-600 mb-4">
          Discover more integrations to extend VetPharm Pro's capabilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'QuickBooks', description: 'Accounting integration', status: 'Coming Soon' },
            { name: 'Slack', description: 'Team communication', status: 'Coming Soon' },
            { name: 'Zapier', description: 'Workflow automation', status: 'Coming Soon' }
          ].map((integration, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">{integration.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
              <div className="mt-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {integration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSave} icon={Save}>
          Save Integration Settings
        </Button>
      </div>
    </div>
  );
};

export default IntegrationSettings;