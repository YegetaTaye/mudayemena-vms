import React from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Stethoscope, 
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Download,
  Eye
} from 'lucide-react';

interface ReportsDashboardProps {
  onNavigate: (view: 'inventory' | 'sales' | 'consultations' | 'custom') => void;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ onNavigate }) => {
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Inventory Value',
      value: '$28,450',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Consultations',
      value: '156',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Stethoscope,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Low Stock Items',
      value: '8',
      change: '-25%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600'
    }
  ];

  const quickReports = [
    {
      title: 'Inventory Summary',
      description: 'Current stock levels and movements',
      icon: Package,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      action: () => onNavigate('inventory')
    },
    {
      title: 'Sales Performance',
      description: 'Revenue trends and financial metrics',
      icon: DollarSign,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      action: () => onNavigate('sales')
    },
    {
      title: 'Consultation Analytics',
      description: 'Patient visits and treatment statistics',
      icon: Stethoscope,
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600',
      action: () => onNavigate('consultations')
    },
    {
      title: 'Custom Reports',
      description: 'Build personalized reports and dashboards',
      icon: BarChart3,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      action: () => onNavigate('custom')
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Monthly Inventory Report',
      type: 'Inventory',
      generatedAt: '2024-01-21T10:30:00Z',
      generatedBy: 'Dr. Sarah Johnson',
      status: 'Completed'
    },
    {
      id: '2',
      name: 'Q4 Sales Analysis',
      type: 'Sales',
      generatedAt: '2024-01-20T14:15:00Z',
      generatedBy: 'Mike Chen',
      status: 'Completed'
    },
    {
      id: '3',
      name: 'Consultation Summary',
      type: 'Consultations',
      generatedAt: '2024-01-19T09:45:00Z',
      generatedBy: 'Dr. Emily Watson',
      status: 'Completed'
    },
    {
      id: '4',
      name: 'Low Stock Alert Report',
      type: 'Inventory',
      generatedAt: '2024-01-18T16:20:00Z',
      generatedBy: 'System',
      status: 'Scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'Processing':
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className={`bg-gradient-to-r ${kpi.color} text-white`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-white opacity-80" />
                </div>
                <div className="ml-4">
                  <p className="text-white opacity-90 text-sm font-medium">{kpi.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      kpi.changeType === 'positive' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {kpi.changeType === 'positive' ? (
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="inline h-3 w-3 mr-1" />
                      )}
                      {kpi.change}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Reports */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickReports.map((report, index) => {
            const Icon = report.icon;
            return (
              <button
                key={index}
                onClick={report.action}
                className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${report.color} hover:scale-105`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <Icon className={`h-8 w-8 ${report.iconColor}`} />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Revenue chart visualization</p>
              <p className="text-sm text-gray-500 mt-2">Interactive chart would be displayed here</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Inventory distribution chart</p>
              <p className="text-sm text-gray-500 mt-2">Category breakdown visualization</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <Button variant="secondary" size="sm">
            View All Reports
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{report.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      <p>{new Date(report.generatedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">by {report.generatedBy}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span>{report.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm" icon={Eye}>
                        View
                      </Button>
                      <Button variant="secondary" size="sm" icon={Download}>
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsDashboard;