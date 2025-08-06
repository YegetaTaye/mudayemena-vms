import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Plus, 
  Settings, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Save,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  Database,
  FileText
} from 'lucide-react';

interface CustomReportsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const CustomReports: React.FC<CustomReportsProps> = ({ onShowToast }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock saved reports
  const savedReports = [
    {
      id: '1',
      name: 'Monthly Inventory Turnover',
      description: 'Track inventory turnover rates by category',
      dataSource: 'Inventory',
      chartType: 'Bar Chart',
      createdAt: '2024-01-15',
      lastRun: '2024-01-21',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Customer Revenue Analysis',
      description: 'Analyze revenue by customer segments',
      dataSource: 'Sales',
      chartType: 'Pie Chart',
      createdAt: '2024-01-10',
      lastRun: '2024-01-20',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Consultation Trends by Species',
      description: 'Track consultation patterns by animal species',
      dataSource: 'Consultations',
      chartType: 'Line Chart',
      createdAt: '2024-01-08',
      lastRun: '2024-01-19',
      status: 'Draft'
    }
  ];

  const dataSources = [
    { id: 'inventory', name: 'Inventory', description: 'Stock levels, movements, valuations' },
    { id: 'sales', name: 'Sales & Deliveries', description: 'Revenue, orders, customer data' },
    { id: 'consultations', name: 'Consultations', description: 'Appointments, treatments, outcomes' },
    { id: 'grn', name: 'Goods Received', description: 'Supplier deliveries, purchase data' },
    { id: 'users', name: 'User Activity', description: 'System usage, audit logs' }
  ];

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
    { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Display trends over time' },
    { id: 'table', name: 'Data Table', icon: FileText, description: 'Detailed tabular data' }
  ];

  const availableFilters = [
    'Date Range',
    'Category',
    'Status',
    'User',
    'Customer',
    'Supplier',
    'Product',
    'Species',
    'Veterinarian'
  ];

  const handleCreateReport = () => {
    if (!reportName.trim()) {
      onShowToast('error', 'Please enter a report name');
      return;
    }
    if (!selectedDataSource) {
      onShowToast('error', 'Please select a data source');
      return;
    }
    if (!selectedChartType) {
      onShowToast('error', 'Please select a chart type');
      return;
    }

    onShowToast('success', 'Custom report created successfully');
    setIsCreating(false);
    setReportName('');
    setReportDescription('');
    setSelectedDataSource('');
    setSelectedChartType('');
    setSelectedFilters([]);
  };

  const handleRunReport = (reportId: string) => {
    onShowToast('success', 'Report generated successfully');
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      onShowToast('success', 'Report deleted successfully');
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Custom Report Builder</h3>
            <p className="text-sm text-gray-600 mt-1">Create personalized reports and dashboards</p>
          </div>
          <Button onClick={() => setIsCreating(true)} icon={Plus}>
            Create New Report
          </Button>
        </div>
      </Card>

      {/* Report Creation Form */}
      {isCreating && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Custom Report</h3>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter report name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Brief description of the report"
                />
              </div>
            </div>

            {/* Data Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Data Source <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dataSources.map((source) => (
                  <label key={source.id} className="relative">
                    <input
                      type="radio"
                      name="dataSource"
                      value={source.id}
                      checked={selectedDataSource === source.id}
                      onChange={(e) => setSelectedDataSource(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDataSource === source.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="font-medium text-gray-900">{source.name}</p>
                          <p className="text-xs text-gray-500">{source.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chart Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {chartTypes.map((chart) => {
                  const Icon = chart.icon;
                  return (
                    <label key={chart.id} className="relative">
                      <input
                        type="radio"
                        name="chartType"
                        value={chart.id}
                        checked={selectedChartType === chart.id}
                        onChange={(e) => setSelectedChartType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedChartType === chart.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <Icon className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                          <p className="font-medium text-gray-900">{chart.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{chart.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Filters</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableFilters.map((filter) => (
                  <label key={filter} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{filter}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReport} icon={Save}>
                Create Report
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Saved Reports */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Reports</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chart Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
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
              {savedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.dataSource}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.chartType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(report.lastRun).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleRunReport(report.id)}
                        icon={Eye}
                      >
                        Run
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={Edit}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={Download}
                      >
                        Export
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDeleteReport(report.id)}
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
      </Card>

      {/* Report Templates */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Inventory Valuation Report',
              description: 'Complete inventory value analysis by category',
              dataSource: 'Inventory',
              chartType: 'Bar Chart'
            },
            {
              name: 'Customer Revenue Dashboard',
              description: 'Top customers and revenue breakdown',
              dataSource: 'Sales',
              chartType: 'Pie Chart'
            },
            {
              name: 'Monthly Consultation Trends',
              description: 'Track consultation patterns over time',
              dataSource: 'Consultations',
              chartType: 'Line Chart'
            },
            {
              name: 'Supplier Performance Report',
              description: 'Analyze supplier delivery and quality metrics',
              dataSource: 'GRN',
              chartType: 'Table'
            },
            {
              name: 'User Activity Summary',
              description: 'System usage and user engagement metrics',
              dataSource: 'Users',
              chartType: 'Bar Chart'
            },
            {
              name: 'Stock Movement Analysis',
              description: 'Track inventory movements and turnover',
              dataSource: 'Inventory',
              chartType: 'Line Chart'
            }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Source: {template.dataSource}</span>
                <span>Type: {template.chartType}</span>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomReports;