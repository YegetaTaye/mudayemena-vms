import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface UserListProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  onAddUser, 
  onEditUser, 
  onViewUser, 
  onDeleteUser, 
  onToggleStatus 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'email' | 'lastLogin'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extended mock data with additional user properties
  const extendedUsers = mockUsers.map(user => ({
    ...user,
    status: user.id === '4' ? 'inactive' as const : 'active' as const,
    phone: user.id === '1' ? '+1-555-0101' : 
           user.id === '2' ? '+1-555-0102' : 
           user.id === '3' ? '+1-555-0103' : '+1-555-0104',
    lastLogin: user.id === '1' ? '2024-01-21T09:30:00Z' :
               user.id === '2' ? '2024-01-21T08:15:00Z' :
               user.id === '3' ? '2024-01-20T16:45:00Z' : '2024-01-18T14:20:00Z',
    createdAt: user.id === '1' ? '2023-01-15T10:00:00Z' :
               user.id === '2' ? '2023-02-20T14:30:00Z' :
               user.id === '3' ? '2023-03-10T11:15:00Z' : '2023-04-05T09:45:00Z',
    permissions: getUserPermissions(user.role)
  }));

  function getUserPermissions(role: User['role']) {
    switch (role) {
      case 'Admin':
        return ['all_modules', 'user_management', 'system_settings', 'audit_logs', 'reports'];
      case 'Staff':
        return ['grn_management', 'delivery_management', 'inventory_view', 'basic_reports'];
      case 'Vet':
        return ['inventory_view', 'consultations', 'basic_reports'];
      case 'Auditor':
        return ['audit_logs', 'reports', 'read_only_access'];
      default:
        return [];
    }
  }

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
        return <Shield className="h-4 w-4" />;
      case 'Staff':
        return <Users className="h-4 w-4" />;
      case 'Vet':
        return <UserCheck className="h-4 w-4" />;
      case 'Auditor':
        return <Activity className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
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

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = extendedUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      
      return true;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'lastLogin':
          aValue = new Date(a.lastLogin).getTime();
          bValue = new Date(b.lastLogin).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = extendedUsers.length;
    const active = extendedUsers.filter(user => user.status === 'active').length;
    const inactive = extendedUsers.filter(user => user.status === 'inactive').length;
    const admins = extendedUsers.filter(user => user.role === 'Admin').length;
    const staff = extendedUsers.filter(user => user.role === 'Staff').length;
    const vets = extendedUsers.filter(user => user.role === 'Vet').length;
    const auditors = extendedUsers.filter(user => user.role === 'Auditor').length;

    return { total, active, inactive, admins, staff, vets, auditors };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-gray-100" />
            </div>
            <div className="ml-4">
              <p className="text-gray-100 text-sm font-medium">Inactive Users</p>
              <p className="text-2xl font-bold">{stats.inactive}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-red-100" />
            </div>
            <div className="ml-4">
              <p className="text-red-100 text-sm font-medium">Administrators</p>
              <p className="text-2xl font-bold">{stats.admins}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-80"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Vet">Vet</option>
              <option value="Auditor">Auditor</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="role-asc">Role A-Z</option>
              <option value="role-desc">Role Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
              <option value="lastLogin-desc">Recently Active</option>
              <option value="lastLogin-asc">Least Active</option>
            </select>
          </div>

          <Button onClick={onAddUser} icon={Plus}>
            Add User
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <div>
                        <p>{new Date(user.lastLogin).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.lastLogin).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onViewUser(user)}
                        icon={Eye}
                      >
                        View
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onEditUser(user)}
                        icon={Edit}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant={user.status === 'active' ? 'warning' : 'success'} 
                        size="sm" 
                        onClick={() => onToggleStatus(user.id)}
                        icon={user.status === 'active' ? UserX : UserCheck}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => onDeleteUser(user.id)}
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'Add your first user to get started.'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserList;