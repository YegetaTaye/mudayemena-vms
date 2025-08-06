import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { useUser } from '../../context/UserContext';
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
  User as UserIcon,
  Database,
  Settings,
  Truck,
  Package,
  Stethoscope,
  BarChart3,
  RefreshCw,
  Archive,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: User['role'];
  action: string;
  module: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'warning' | 'error' | 'info';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const AuditLogsModule: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | string>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | string>('all');
  const [actionFilter, setActionFilter] = useState<'all' | string>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'CREATE',
      module: 'User Management',
      resourceType: 'User',
      resourceId: 'user-5',
      details: 'Created new user account for Mike Chen with Staff role',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123def456',
      severity: 'medium',
      status: 'success',
      changes: [
        { field: 'name', oldValue: '', newValue: 'Mike Chen' },
        { field: 'email', oldValue: '', newValue: 'mike.chen@vetpharm.com' },
        { field: 'role', oldValue: '', newValue: 'Staff' }
      ]
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'LOGIN',
      module: 'Authentication',
      resourceType: 'Session',
      details: 'Successful login to system',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_xyz789abc123',
      severity: 'low',
      status: 'success'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'CREATE',
      module: 'GRN Management',
      resourceType: 'GRN',
      resourceId: 'grn-2024-001',
      details: 'Created GRN-2024-001 for VetMed Supplies Inc. with total value $1,362.25',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_xyz789abc123',
      severity: 'medium',
      status: 'success',
      changes: [
        { field: 'supplier', oldValue: '', newValue: 'VetMed Supplies Inc.' },
        { field: 'total_amount', oldValue: '0', newValue: '1362.25' },
        { field: 'status', oldValue: '', newValue: 'Pending' }
      ]
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      userId: '3',
      userName: 'Dr. Emily Watson',
      userRole: 'Vet',
      action: 'VIEW',
      module: 'Inventory Management',
      resourceType: 'Inventory',
      resourceId: 'inv-1',
      details: 'Viewed BIN card for Amoxicillin 500mg (AMX500)',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456ghi789',
      severity: 'low',
      status: 'success'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'UPDATE',
      module: 'System Settings',
      resourceType: 'Configuration',
      resourceId: 'config-inventory',
      details: 'Updated minimum stock level thresholds for automatic alerts',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123def456',
      severity: 'high',
      status: 'success',
      changes: [
        { field: 'min_stock_threshold', oldValue: '10', newValue: '15' },
        { field: 'alert_enabled', oldValue: 'false', newValue: 'true' }
      ]
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'LOGIN_FAILED',
      module: 'Authentication',
      resourceType: 'Session',
      details: 'Failed login attempt - invalid password',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: '',
      severity: 'medium',
      status: 'warning'
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      userId: '4',
      userName: 'James Wilson',
      userRole: 'Auditor',
      action: 'EXPORT',
      module: 'Reports',
      resourceType: 'Report',
      resourceId: 'report-monthly-inventory',
      details: 'Generated and exported monthly inventory report',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_ghi789jkl012',
      severity: 'low',
      status: 'success'
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      userId: '2',
      userName: 'Mike Chen',
      userRole: 'Staff',
      action: 'CREATE',
      module: 'Delivery Management',
      resourceType: 'DeliveryNote',
      resourceId: 'dn-2024-002',
      details: 'Created delivery note DN-2024-002 for City Animal Hospital',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_xyz789abc123',
      severity: 'medium',
      status: 'success'
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Admin',
      action: 'UPDATE',
      module: 'User Management',
      resourceType: 'User',
      resourceId: 'user-4',
      details: 'Deactivated user account for James Wilson',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123def456',
      severity: 'high',
      status: 'success',
      changes: [
        { field: 'status', oldValue: 'active', newValue: 'inactive' },
        { field: 'deactivated_at', oldValue: '', newValue: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      id: '10',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      userId: '3',
      userName: 'Dr. Emily Watson',
      userRole: 'Vet',
      action: 'CREATE',
      module: 'Consultations',
      resourceType: 'Consultation',
      resourceId: 'con-2024-156',
      details: 'Recorded consultation for patient Buddy (Golden Retriever)',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456ghi789',
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
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
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
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
      case 'info':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'UPDATE':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'DELETE':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'VIEW':
        return <Eye className="h-4 w-4 text-gray-600" />;
      case 'LOGIN':
        return <UserIcon className="h-4 w-4 text-green-600" />;
      case 'LOGOUT':
        return <UserIcon className="h-4 w-4 text-gray-600" />;
      case 'LOGIN_FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'EXPORT':
        return <Download className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'User Management':
        return <Users className="h-4 w-4" />;
      case 'Authentication':
        return <Shield className="h-4 w-4" />;
      case 'GRN Management':
        return <FileText className="h-4 w-4" />;
      case 'Delivery Management':
        return <Truck className="h-4 w-4" />;
      case 'Inventory Management':
        return <Package className="h-4 w-4" />;
      case 'Consultations':
        return <Stethoscope className="h-4 w-4" />;
      case 'Reports':
        return <BarChart3 className="h-4 w-4" />;
      case 'System Settings':
        return <Settings className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
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
    return auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      const withinDateRange = logDate >= startDate && logDate <= endDate;
      const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.module.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = userFilter === 'all' || log.userId === userFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      
      return withinDateRange && matchesSearch && matchesUser && matchesModule && 
             matchesAction && matchesSeverity && matchesStatus;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchTerm, userFilter, moduleFilter, actionFilter, severityFilter, statusFilter, dateRange]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const success = filteredLogs.filter(log => log.status === 'success').length;
    const warnings = filteredLogs.filter(log => log.status === 'warning').length;
    const errors = filteredLogs.filter(log => log.status === 'error').length;
    const critical = filteredLogs.filter(log => log.severity === 'critical').length;
    const high = filteredLogs.filter(log => log.severity === 'high').length;

    return { total, success, warnings, errors, critical, high };
  }, [filteredLogs]);

  const modules = [...new Set(auditLogs.map(log => log.module))];
  const actions = [...new Set(auditLogs.map(log => log.action))];

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Resource Type', 'Details', 'Status', 'Severity', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.userRole,
        log.action,
        log.module,
        log.resourceType,
        `"${log.details}"`,
        log.status,
        log.severity,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Audit logs exported successfully');
  };

  const handleViewDetails = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleArchiveLogs = () => {
    showToast('success', 'Logs archived successfully');
  };

  const handleRefreshLogs = () => {
    showToast('info', 'Audit logs refreshed');
  };

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Events</p>
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

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-orange-100" />
            </div>
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">High Priority</p>
              <p className="text-2xl font-bold">{stats.high}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Critical</p>
              <p className="text-2xl font-bold">{stats.critical}</p>
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
                placeholder="Search audit logs..."
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

            {/* Filters */}
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

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Actions</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleRefreshLogs} icon={RefreshCw} variant="secondary" size="sm">
              Refresh
            </Button>
            <Button onClick={handleArchiveLogs} icon={Archive} variant="secondary" size="sm">
              Archive
            </Button>
            <Button onClick={handleExportLogs} icon={Download} variant="secondary" size="sm">
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getModuleIcon(log.module)}
                      <span className="text-sm text-gray-600">{log.module}</span>
                    </div>
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
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleViewDetails(log)}
                      icon={Eye}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Logs Found</h3>
            <p className="text-gray-600">
              No audit logs found for the selected criteria.
            </p>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isDetailModalOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsDetailModalOpen(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{new Date(selectedEntry.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedEntry.sessionId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900">{selectedEntry.userName} ({selectedEntry.userRole})</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedEntry.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action</label>
                    <p className="text-sm text-gray-900">{selectedEntry.action}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module</label>
                    <p className="text-sm text-gray-900">{selectedEntry.module}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                    <p className="text-sm text-gray-900">{selectedEntry.resourceType}</p>
                  </div>
                  {selectedEntry.resourceId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resource ID</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedEntry.resourceId}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedEntry.details}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Agent</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">{selectedEntry.userAgent}</p>
                </div>
                
                {selectedEntry.changes && selectedEntry.changes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Changes Made</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedEntry.changes.map((change, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm font-medium text-gray-700">{change.field}:</span>
                          <div className="text-sm">
                            <span className="text-red-600 line-through">{change.oldValue || 'empty'}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600">{change.newValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

export default AuditLogsModule;