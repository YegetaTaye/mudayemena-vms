import React, { useState, useMemo } from 'react';
import { mockDeliveryNotes, mockGRNs } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  BarChart3,
  PieChart,
  FileText,
  Package,
  Truck,
  Users
} from 'lucide-react';

interface SalesReportsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const SalesReports: React.FC<SalesReportsProps> = ({ onShowToast }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState<'revenue' | 'deliveries' | 'customers' | 'trends'>('revenue');

  // Mock sales data based on delivery notes
  const salesData = useMemo(() => {
    const deliveries = mockDeliveryNotes.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    const totalRevenue = deliveries.reduce((sum, delivery) => sum + delivery.grandTotal, 0);
    const totalDeliveries = deliveries.length;
    const averageOrderValue = totalRevenue / totalDeliveries || 0;
    
    // Group by customer
    const customerStats = deliveries.reduce((acc, delivery) => {
      if (!acc[delivery.recipientName]) {
        acc[delivery.recipientName] = {
          name: delivery.recipientName,
          orders: 0,
          totalValue: 0
        };
      }
      acc[delivery.recipientName].orders += 1;
      acc[delivery.recipientName].totalValue += delivery.grandTotal;
      return acc;
    }, {} as Record<string, { name: string; orders: number; totalValue: number }>);

    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Monthly revenue trend (mock data)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 12500, deliveries: 15 },
      { month: 'Feb', revenue: 15200, deliveries: 18 },
      { month: 'Mar', revenue: 18900, deliveries: 22 },
      { month: 'Apr', revenue: 16800, deliveries: 20 },
      { month: 'May', revenue: 21300, deliveries: 25 },
      { month: 'Jun', revenue: 19600, deliveries: 23 }
    ];

    return {
      totalRevenue,
      totalDeliveries,
      averageOrderValue,
      topCustomers,
      monthlyRevenue,
      deliveries
    };
  }, [dateRange]);

  const handleExportReport = (type: string) => {
    onShowToast('success', `${type} report exported successfully`);
  };

  const handleGenerateReport = () => {
    onShowToast('success', 'Sales report generated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="revenue">Revenue Analysis</option>
              <option value="deliveries">Delivery Performance</option>
              <option value="customers">Customer Analysis</option>
              <option value="trends">Sales Trends</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleGenerateReport} icon={FileText} variant="secondary">
              Generate Report
            </Button>
            <Button onClick={() => handleExportReport('Sales')} icon={Download}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</p>
                <p className="ml-2 text-sm font-medium text-green-200">
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
              <Truck className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Total Deliveries</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{salesData.totalDeliveries}</p>
                <p className="ml-2 text-sm font-medium text-blue-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +8.3%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">${salesData.averageOrderValue.toFixed(0)}</p>
                <p className="ml-2 text-sm font-medium text-purple-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +5.2%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-orange-100" />
            </div>
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">Active Customers</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{salesData.topCustomers.length}</p>
                <p className="ml-2 text-sm font-medium text-orange-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +15%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Revenue trend chart</p>
              <p className="text-sm text-gray-500 mt-2">6-month revenue progression</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Customer</h3>
          <div className="space-y-4">
            {salesData.topCustomers.map((customer, index) => (
              <div key={customer.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-green-500 to-green-600' :
                    index === 1 ? 'from-blue-500 to-blue-600' :
                    index === 2 ? 'from-purple-500 to-purple-600' :
                    index === 3 ? 'from-orange-500 to-orange-600' :
                    'from-gray-500 to-gray-600'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${customer.totalValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {((customer.totalValue / salesData.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Delivery Performance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {delivery.deliveryNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {delivery.recipientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      delivery.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${delivery.grandTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {delivery.items.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Performance Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.monthlyRevenue.map((month, index) => {
                const prevMonth = index > 0 ? salesData.monthlyRevenue[index - 1] : null;
                const growth = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 : 0;
                
                return (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${month.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {month.deliveries}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${(month.revenue / month.deliveries).toFixed(0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : growth < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        ) : null}
                        <span className={`text-sm font-medium ${
                          growth > 0 ? 'text-green-600' : 
                          growth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SalesReports;