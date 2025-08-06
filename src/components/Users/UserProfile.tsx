import React from 'react';
import { User } from '../../types';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Activity, 
  CheckCircle, 
  XCircle,
  Edit,
  Download,
  Clock,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

interface UserProfileProps {
  user: (User & { 
    status?: 'active' | 'inactive'; 
    phone?: string; 
    permissions?: string[];
    lastLogin?: string;
    createdAt?: string;
  }) | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOpen, onClose, onEdit }) => {
  if (!user) return null;

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Staff':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vet':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Auditor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-5 w-5" />;
      case 'Staff':
        return <Users className="h-5 w-5" />;
      case 'Vet':
        return <Activity className="h-5 w-5" />;
      case 'Auditor':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
  };

  const permissionLabels = {
    all_modules: 'All Modules Access',
    user_management: 'User Management',
    system_settings: 'System Settings',
    audit_logs: 'Audit Logs',
    reports: 'Reports & Analytics',
    grn_management: 'GRN Management',
    delivery_management: 'Delivery Management',
    inventory_management: 'Inventory Management',
    inventory_view: 'Inventory View Only',
    consultations: 'Consultations',
    basic_reports: 'Basic Reports',
    read_only_access: 'Read-Only Access'
  };

  const handleExportProfile = () => {
    const blob = new Blob([`User Profile: ${user.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-profile-${user.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mock activity data
  const recentActivity = [
    {
      id: '1',
      action: 'Logged in to system',
      timestamp: '2024-01-21T09:30:00Z',
      details: 'Successful login from Chrome browser'
    },
    {
      id: '2',
      action: 'Created GRN-2024-001',
      timestamp: '2024-01-21T10:15:00Z',
      details: 'New goods received note for VetMed Supplies'
    },
    {
      id: '3',
      action: 'Updated inventory item',
      timestamp: '2024-01-21T11:45:00Z',
      details: 'Modified stock levels for Amoxicillin 500mg'
    },
    {
      id: '4',
      action: 'Generated delivery note',
      timestamp: '2024-01-21T14:20:00Z',
      details: 'DN-2024-003 for City Animal Hospital'
    },
    {
      id: '5',
      action: 'Logged out',
      timestamp: '2024-01-21T17:00:00Z',
      details: 'Session ended normally'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{user.role}</span>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status || 'active')}`}>
                    {getStatusIcon(user.status || 'active')}
                    <span className="capitalize">{user.status || 'active'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">User ID: {user.id}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={handleExportProfile} icon={Download} size="sm">
                Export
              </Button>
              <Button onClick={onEdit} icon={Edit} size="sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Member Since</p>
                  <p className="text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Login</p>
                  <p className="text-sm text-gray-900">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Permissions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions & Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(user.permissions || []).map((permission) => (
              <div key={permission} className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-emerald-800">
                  {permissionLabels[permission as keyof typeof permissionLabels] || permission}
                </span>
              </div>
            ))}
          </div>
          {(!user.permissions || user.permissions.length === 0) && (
            <p className="text-sm text-gray-500 italic">No specific permissions assigned</p>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-600">GRNs Created</p>
          </Card>
          <Card className="text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">18</p>
            <p className="text-sm text-gray-600">Deliveries Processed</p>
          </Card>
          <Card className="text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Total Actions</p>
          </Card>
          <Card className="text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">42h</p>
            <p className="text-sm text-gray-600">Time Active</p>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfile;