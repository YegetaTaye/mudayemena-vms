import React, { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  FileText, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Truck,
  Stethoscope,
  Users,
  BarChart3,
  ClipboardList,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  Eye,
  Plus,
  ArrowRight,
  Shield,
  Database,
  Bell
} from 'lucide-react';

interface DashboardProps {
  onNavigateToModule?: (moduleId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToModule }) => {
  const { user } = useUser();

  // Mock data - in a real app, this would come from API calls
  const dashboardData = useMemo(() => {
    return {
      // GRN Stats
      grn: {
        total: 24,
        pending: 3,
        approved: 18,
        rejected: 1,
        totalValue: 45230,
        recentGRNs: [
          { id: 'GRN-2024-001', supplier: 'VetMed Supplies Inc.', value: 1362.25, status: 'Approved' },
          { id: 'GRN-2024-002', supplier: 'Animal Health Solutions', value: 243.75, status: 'Pending' },
          { id: 'GRN-2024-003', supplier: 'PharmaPet Distribution', value: 255.00, status: 'Pending' }
        ]
      },
      
      // Delivery Stats
      delivery: {
        total: 18,
        pending: 2,
        inTransit: 3,
        delivered: 12,
        confirmed: 1,
        totalValue: 28450,
        recentDeliveries: [
          { id: 'DN-2024-001', recipient: 'City Animal Hospital', value: 440.00, status: 'Delivered' },
          { id: 'DN-2024-002', recipient: 'Paws & Claws Clinic', value: 389.70, status: 'In Transit' },
          { id: 'DN-2024-003', recipient: 'Dr. Michael Rodriguez', value: 81.25, status: 'Pending' }
        ]
      },
      
      // Inventory Stats
      inventory: {
        totalItems: 8,
        lowStock: 1,
        normalStock: 6,
        highStock: 1,
        totalValue: 28450,
        criticalItems: [
          { name: 'Cerenia 16mg', currentStock: 15, minimumLevel: 20, code: 'CER16' }
        ]
      },
      
      // Consultation Stats
      consultations: {
        total: 156,
        scheduled: 8,
        completed: 142,
        cancelled: 6,
        totalRevenue: 12450,
        todayAppointments: 5,
        upcomingAppointments: [
          { time: '09:00', patient: 'Buddy', owner: 'John Smith', type: 'Consultation' },
          { time: '10:30', patient: 'Whiskers', owner: 'Sarah Johnson', type: 'Follow-up' },
          { time: '14:00', patient: 'Max', owner: 'Michael Brown', type: 'Vaccination' }
        ]
      },
      
      // User Management Stats
      users: {
        total: 4,
        active: 3,
        inactive: 1,
        admins: 1,
        staff: 1,
        vets: 1,
        auditors: 1,
        recentActivity: [
          { user: 'Mike Chen', action: 'Created GRN-2024-001', time: '2 hours ago' },
          { user: 'Dr. Emily Watson', action: 'Completed consultation', time: '4 hours ago' },
          { user: 'Dr. Sarah Johnson', action: 'Approved GRN-2024-002', time: '6 hours ago' }
        ]
      },
      
      // System Stats
      system: {
        uptime: '99.9%',
        lastBackup: '2024-01-21T02:00:00Z',
        activeUsers: 3,
        systemHealth: 'Good',
        alerts: [
          { type: 'warning', message: 'Low stock alert: Cerenia 16mg', time: '1 hour ago' },
          { type: 'info', message: 'Backup completed successfully', time: '6 hours ago' }
        ]
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'delivered':
      case 'completed':
      case 'active':
        return 'text-green-600';
      case 'pending':
      case 'scheduled':
        return 'text-yellow-600';
      case 'rejected':
      case 'cancelled':
      case 'inactive':
        return 'text-red-600';
      case 'in transit':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const moduleCards = [
    {
      id: 'grn',
      title: 'Goods Received Notes',
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
      stats: [
        { label: 'Total GRNs', value: dashboardData.grn.total },
        { label: 'Pending Approval', value: dashboardData.grn.pending },
        { label: 'Total Value', value: `$${dashboardData.grn.totalValue.toLocaleString()}` }
      ],
      hasAccess: ['Admin', 'Staff'].includes(user?.role || '')
    },
    {
      id: 'delivery',
      title: 'Delivery Notes',
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      stats: [
        { label: 'Total Deliveries', value: dashboardData.delivery.total },
        { label: 'In Transit', value: dashboardData.delivery.inTransit },
        { label: 'Total Value', value: `$${dashboardData.delivery.totalValue.toLocaleString()}` }
      ],
      hasAccess: ['Admin', 'Staff'].includes(user?.role || '')
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      stats: [
        { label: 'Total Items', value: dashboardData.inventory.totalItems },
        { label: 'Low Stock', value: dashboardData.inventory.lowStock },
        { label: 'Total Value', value: `$${dashboardData.inventory.totalValue.toLocaleString()}` }
      ],
      hasAccess: ['Admin', 'Staff', 'Vet'].includes(user?.role || '')
    },
    {
      id: 'consultations',
      title: 'Consultations',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      stats: [
        { label: 'Total Consultations', value: dashboardData.consultations.total },
        { label: 'Today\'s Appointments', value: dashboardData.consultations.todayAppointments },
        { label: 'Revenue', value: `$${dashboardData.consultations.totalRevenue.toLocaleString()}` }
      ],
      hasAccess: ['Admin', 'Vet'].includes(user?.role || '')
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      stats: [
        { label: 'Total Users', value: dashboardData.users.total },
        { label: 'Active Users', value: dashboardData.users.active },
        { label: 'Administrators', value: dashboardData.users.admins }
      ],
      hasAccess: ['Admin'].includes(user?.role || '')
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      stats: [
        { label: 'System Uptime', value: dashboardData.system.uptime },
        { label: 'Active Users', value: dashboardData.system.activeUsers },
        { label: 'Health Status', value: dashboardData.system.systemHealth }
      ],
      hasAccess: ['Admin', 'Auditor'].includes(user?.role || '')
    }
  ];

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening in your veterinary pharmacy today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="flex items-center justify-end mt-1">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  ${(dashboardData.grn.totalValue + dashboardData.delivery.totalValue + dashboardData.consultations.totalRevenue).toLocaleString()}
                </p>
                <p className="ml-2 text-sm font-medium text-emerald-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12.5%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Active Operations</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {dashboardData.grn.pending + dashboardData.delivery.inTransit + dashboardData.consultations.scheduled}
                </p>
                <p className="ml-2 text-sm font-medium text-blue-200">
                  <Clock className="inline h-3 w-3 mr-1" />
                  In Progress
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-100" />
            </div>
            <div className="ml-4">
              <p className="text-red-100 text-sm font-medium">Alerts & Issues</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {dashboardData.inventory.lowStock + dashboardData.system.alerts.filter(a => a.type === 'warning').length}
                </p>
                <p className="ml-2 text-sm font-medium text-red-200">
                  <AlertTriangle className="inline h-3 w-3 mr-1" />
                  Needs Attention
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">System Health</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{dashboardData.system.uptime}</p>
                <p className="ml-2 text-sm font-medium text-purple-200">
                  <CheckCircle className="inline h-3 w-3 mr-1" />
                  Uptime
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleCards.map((module) => {
          const Icon = module.icon;
          
          if (!module.hasAccess) {
            return (
              <Card key={module.id} className="opacity-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-r ${module.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  </div>
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center py-4">
                  Access restricted for your role
                </p>
              </Card>
            );
          }

          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-r ${module.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onNavigateToModule?.(module.id)}
                  icon={ArrowRight}
                >
                  Open
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {module.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <Button variant="secondary" size="sm" icon={Eye}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {dashboardData.users.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
            <Button variant="secondary" size="sm" icon={Plus}>
              Add Appointment
            </Button>
          </div>
          <div className="space-y-3">
            {dashboardData.consultations.upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <p className="text-xs text-gray-600">{appointment.patient} - {appointment.owner}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {appointment.type}
                </span>
              </div>
            ))}
            {dashboardData.consultations.upcomingAppointments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for today</p>
            )}
          </div>
        </Card>
      </div>

      {/* Critical Alerts and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Critical Alerts
            </h3>
            <Button variant="secondary" size="sm" icon={Bell}>
              Manage Alerts
            </Button>
          </div>
          <div className="space-y-3">
            {/* Low Stock Alerts */}
            {dashboardData.inventory.criticalItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Low Stock: {item.name}</p>
                    <p className="text-xs text-red-700">
                      Current: {item.currentStock} | Minimum: {item.minimumLevel}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Reorder
                </Button>
              </div>
            ))}
            
            {/* System Alerts */}
            {dashboardData.system.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                    }`}>
                      {alert.message}
                    </p>
                    <p className={`text-xs ${
                      alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {alert.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {user.role === 'Admin' || user.role === 'Staff' ? (
              <>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('grn')}
                >
                  <FileText className="h-6 w-6 mb-2 text-emerald-600" />
                  <span className="text-sm">Create GRN</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('delivery')}
                >
                  <Truck className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-sm">New Delivery</span>
                </Button>
              </>
            ) : null}
            
            {user.role === 'Admin' || user.role === 'Staff' || user.role === 'Vet' ? (
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => onNavigateToModule?.('inventory')}
              >
                <Package className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm">Check Inventory</span>
              </Button>
            ) : null}
            
            {user.role === 'Admin' || user.role === 'Vet' ? (
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => onNavigateToModule?.('consultations')}
              >
                <Stethoscope className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">New Consultation</span>
              </Button>
            ) : null}
            
            {user.role === 'Admin' || user.role === 'Auditor' ? (
              <>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('reports')}
                >
                  <BarChart3 className="h-6 w-6 mb-2 text-indigo-600" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('audit')}
                >
                  <ClipboardList className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="text-sm">Audit Logs</span>
                </Button>
              </>
            ) : null}
            
            {user.role === 'Admin' ? (
              <>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('users')}
                >
                  <Users className="h-6 w-6 mb-2 text-red-600" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => onNavigateToModule?.('settings')}
                >
                  <Settings className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-sm">Settings</span>
                </Button>
              </>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent GRNs */}
        {(user.role === 'Admin' || user.role === 'Staff') && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent GRNs</h3>
              <Button variant="secondary" size="sm" onClick={() => onNavigateToModule?.('grn')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {dashboardData.grn.recentGRNs.map((grn, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{grn.id}</p>
                    <p className="text-xs text-gray-600">{grn.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${grn.value.toFixed(2)}</p>
                    <p className={`text-xs ${getStatusColor(grn.status)}`}>{grn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Deliveries */}
        {(user.role === 'Admin' || user.role === 'Staff') && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
              <Button variant="secondary" size="sm" onClick={() => onNavigateToModule?.('delivery')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {dashboardData.delivery.recentDeliveries.map((delivery, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{delivery.id}</p>
                    <p className="text-xs text-gray-600">{delivery.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${delivery.value.toFixed(2)}</p>
                    <p className={`text-xs ${getStatusColor(delivery.status)}`}>{delivery.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* System Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">Database</p>
            <p className="text-xs text-green-600">Connected</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800">Last Backup</p>
            <p className="text-xs text-blue-600">
              {new Date(dashboardData.system.lastBackup).toLocaleDateString()}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-800">Active Users</p>
            <p className="text-xs text-purple-600">{dashboardData.system.activeUsers} online</p>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-800">System Status</p>
            <p className="text-xs text-emerald-600">{dashboardData.system.systemHealth}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;