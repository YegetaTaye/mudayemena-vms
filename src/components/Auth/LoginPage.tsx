import React, { useState } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { 
  Stethoscope, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
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

  const sampleAccounts = [
    {
      user: mockUsers[0], // Admin
      email: 'admin@vetpharm.com',
      password: 'admin123',
      description: 'Full system access - All modules and user management',
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      user: mockUsers[1], // Staff
      email: 'staff@vetpharm.com',
      password: 'staff123',
      description: 'GRN, Delivery, and Inventory management',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      user: mockUsers[2], // Vet
      email: 'vet@vetpharm.com',
      password: 'vet123',
      description: 'Inventory access and consultation management',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600'
    },
    {
      user: mockUsers[3], // Auditor
      email: 'auditor@vetpharm.com',
      password: 'auditor123',
      description: 'Read-only access to reports and audit logs',
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const account = sampleAccounts.find(acc => 
      acc.email === email && acc.password === password
    );

    if (account) {
      showToast('success', `Welcome back, ${account.user.name}!`);
      setTimeout(() => {
        onLogin(account.user);
      }, 1500);
    } else {
      showToast('error', 'Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (account: typeof sampleAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedAccount(account.user.id);
    showToast('info', `Credentials filled for ${account.user.role} account`);
  };

  const getRolePermissions = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return [
          'Full system administration',
          'User management and permissions',
          'All module access (GRN, Delivery, Inventory)',
          'Reports and analytics',
          'System settings and configuration',
          'Audit logs and compliance'
        ];
      case 'Staff':
        return [
          'Create and manage GRNs',
          'Process delivery notes',
          'Update inventory records',
          'View basic reports',
          'Stock movement tracking'
        ];
      case 'Vet':
        return [
          'View inventory levels',
          'Access consultation module',
          'Check stock availability',
          'View product information',
          'Basic reporting access'
        ];
      case 'Auditor':
        return [
          'Read-only access to all data',
          'Generate compliance reports',
          'View audit trails',
          'Export data for analysis',
          'Monitor system activities'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding and Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg">
                <Stethoscope className="h-12 w-12 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-4xl font-bold text-gray-900">VetPharm Pro</h1>
                <p className="text-lg text-gray-600">Veterinary Pharmacy Management</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Professional inventory management system designed specifically for veterinary pharmacies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span>GRN Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Delivery Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <span>Inventory Control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Compliance Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Accounts */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Demo Accounts</h3>
            <p className="text-sm text-gray-600 mb-6">
              Click on any account below to auto-fill login credentials and explore different user roles.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleAccounts.map((account) => {
                const Icon = account.icon;
                const isSelected = selectedAccount === account.user.id;
                
                return (
                  <button
                    key={account.user.id}
                    onClick={() => handleQuickLogin(account)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`bg-gradient-to-r ${account.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{account.user.role}</p>
                        <p className="text-xs text-gray-500">{account.user.name}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{account.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your veterinary pharmacy dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Role Permissions Info */}
            {selectedAccount && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {sampleAccounts.find(acc => acc.user.id === selectedAccount)?.user.role} Permissions:
                </h4>
                <ul className="space-y-1">
                  {getRolePermissions(sampleAccounts.find(acc => acc.user.id === selectedAccount)?.user.role || 'Staff').map((permission, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Demo system - Use the sample accounts above to explore different user roles
              </p>
            </div>
          </div>
        </div>
      </div>

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

export default LoginPage;