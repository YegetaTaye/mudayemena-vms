import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Eye, 
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User as UserIcon
} from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: User['role'];
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high';
  status: 'success' | 'warning' | 'error';
}

interface ActivityLogProps {
  currentUser: User;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | string>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | string>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mock activity log data
  const activityLogs: ActivityLogEntry[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'User Created',
      module: 'User Management',
      details: 'Created new user account for Mike Chen',
      timestamp: '2024-01-21T09:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'medium',
      status: 'success'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'Login',
      module: 'Authentication',
      details: 'Successful login to system',
      timestamp: '2024-01-21T08:15:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'low',
      status: 'success'
    },
    {
      id: '3',
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'GRN Created',
      module: 'GRN Management',
      details: 'Created GRN-2024-001 for VetMed Supplies Inc.',
      timestamp: '2024-01-21T10:45:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'medium',
      status: 'success'
    },
    {
      id: '4',
      userId: '3',
      userName: 'Dr. Emily Watson',
      userRole: 'Vet',
      action: 'Inventory Access',
      module: 'Inventory Management',
      details: 'Viewed BIN card for Amoxicillin 500mg',
      timestamp: '2024-01-21T11:20:00Z',
      ipAddress: '192.168.1.102',
      userAgent: 'Firefox/121.0.0.0',
      severity: 'low',
      status: 'success'
    },
    {
      id: '5',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'System Settings Modified',
      module: 'System Settings',
      details: 'Updated minimum stock level thresholds',
      timestamp: '2024-01-21T14:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'high',
      status: 'success'
    },
    {
      id: '6',
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'Failed Login Attempt',
      module: 'Authentication',
      details: 'Invalid password entered',
      timestamp: '2024-01-20T16:45:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'medium',
      status: 'warning'
    },
    {
      id: '7',
      userId: '4',
      userName: 'James Wilson',
      userRole: 'Auditor',
      action: 'Report Generated',
      module: 'Reports',
      details: 'Generated monthly inventory report',
      timestamp: '2024-01-20T13:15:00Z',
      ipAddress: '192.168.1.103',
      userAgent: 'Edge/120.0.0.0',
      severity: 'low',
      status: 'success'
    },
    {
      id: '8',
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'Delivery Note Created',
      module: 'Delivery Management',
      details: 'Created DN-2024-002 for City Animal Hospital',
      timestamp: '2024-01-20T15:30:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'medium',
      status: 'success'
    },
    {
      id: '9',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'User Status Changed',
      module: 'User Management',
      details: 'Deactivated user account for James Wilson',
      timestamp: '2024-01-19T11:00:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0',
      severity: 'high',
      status: 'success'
    },
    {
      id: '10',
      userId: '3',
      userName: 'Dr. Emily Watson',
      userRole: 'Vet',
      action: 'Consultation Recorded',
      module: 'Consultations',
      details: 'Recorded consultation for patient ID: P-2024-156',
      timestamp: '2024-01-19T09:45:00Z',
      ipAddress: '192.168.1.102',
      userAgent: 'Firefox/121.0.0.0',
      severity: 'low',
      status: 'success'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      const withinDateRange = logDate >= startDate && logDate <= endDate;
      const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = userFilter === 'all' || log.userId === userFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      
      return withinDateRange && matchesSearch && matchesUser && matchesModule && matchesSeverity;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchTerm, userFilter, moduleFilter, severityFilter, dateRange]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const success = filteredLogs.filter(log => log.status === 'success').length;
    const warnings = filteredLogs.filter(log => log.status === 'warning').length;
    const errors = filteredLogs.filter(log => log.status === 'error').length;
    const highSeverity = filteredLogs.filter(log => log.severity === 'high').length;

    return { total, success, warnings, errors, highSeverity };
  }, [filteredLogs]);

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'Status', 'Severity', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.userRole,
        log.action,
        log.module,
        log.details,
        log.status,
        log.severity,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const modules = [...new Set(activityLogs.map(log => log.module))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Activities</p>
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
              <p className="text-green-100 text-sm font-medium">Successful</p>
              <p className="text-2xl font-bold">{stats.success}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-100" />
            </div>
            <div className="ml-4">
              <p className="text-yellow-100 text-sm font-medium">Warnings</p>
              <p className="text-2xl font-bold">{stats.warnings}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-100" />
            </div>
            <div className="ml-4">
              <p className="text-red-100 text-sm font-medium">Errors</p>
              <p className="text-2xl font-bold">{stats.errors}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">High Priority</p>
              <p className="text-2xl font-bold">{stats.highSeverity}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
              />
            </div>

            {/* Date Range */}
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* User Filter */}
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Users</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            {/* Module Filter */}
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Modules</option>
              {modules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Button onClick={handleExportLogs} icon={Download} variant="secondary">
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Activity Log Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(log.userRole)}`}>
                          {log.userRole}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.action}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{log.module}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      <span className="capitalize">{log.status}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                      <span className="capitalize">{log.severity}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      IP: {log.ipAddress}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h3>
            <p className="text-gray-600">
              No activities found for the selected criteria.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLog;