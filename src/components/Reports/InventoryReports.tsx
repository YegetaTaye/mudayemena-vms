import React, { useState, useMemo } from 'react';
import { mockInventory, mockStockMovements } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Search,
  FileText
} from 'lucide-react';

interface InventoryReportsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const InventoryReports: React.FC<InventoryReportsProps> = ({ onShowToast }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [reportType, setReportType] = useState<'summary' | 'movements' | 'valuation' | 'alerts'>('summary');

  const getStockStatus = (item: any) => {
    if (item.currentStock <= item.minimumLevel) return 'low';
    if (item.currentStock >= item.maximumLevel) return 'high';
    return 'normal';
  };

  const inventoryStats = useMemo(() => {
    const totalItems = mockInventory.length;
    const totalValue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
    const lowStockItems = mockInventory.filter(item => getStockStatus(item) === 'low').length;
    const highStockItems = mockInventory.filter(item => getStockStatus(item) === 'high').length;
    const categories = [...new Set(mockInventory.map(item => item.category).filter(Boolean))];
    
    return { totalItems, totalValue, lowStockItems, highStockItems, categories };
  }, []);

  const categoryData = useMemo(() => {
    const categoryStats = inventoryStats.categories.map(category => {
      const items = mockInventory.filter(item => item.category === category);
      const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
      const totalQuantity = items.reduce((sum, item) => sum + item.currentStock, 0);
      
      return {
        category,
        itemCount: items.length,
        totalValue,
        totalQuantity,
        percentage: (totalValue / inventoryStats.totalValue) * 100
      };
    });
    
    return categoryStats.sort((a, b) => b.totalValue - a.totalValue);
  }, [inventoryStats]);

  const lowStockItems = mockInventory.filter(item => getStockStatus(item) === 'low');
  const recentMovements = mockStockMovements
    .filter(movement => {
      const movementDate = new Date(movement.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return movementDate >= startDate && movementDate <= endDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleExportReport = (type: string) => {
    onShowToast('success', `${type} report exported successfully`);
  };

  const handleGenerateReport = () => {
    onShowToast('success', 'Inventory report generated successfully');
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {inventoryStats.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="summary">Summary Report</option>
              <option value="movements">Stock Movements</option>
              <option value="valuation">Inventory Valuation</option>
              <option value="alerts">Stock Alerts</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleGenerateReport} icon={FileText} variant="secondary">
              Generate Report
            </Button>
            <Button onClick={() => handleExportReport('Inventory')} icon={Download}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-100" />
            </div>
            <div className="ml-4">
              <p className="text-red-100 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold">{inventoryStats.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">High Stock</p>
              <p className="text-2xl font-bold">{inventoryStats.highStockItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Value by Category</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-green-500 to-green-600' :
                    index === 2 ? 'from-purple-500 to-purple-600' :
                    index === 3 ? 'from-orange-500 to-orange-600' :
                    'from-gray-500 to-gray-600'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${category.totalValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Stock movement chart</p>
              <p className="text-sm text-gray-500 mt-2">Received vs Issued trends</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Low Stock Alerts ({lowStockItems.length} items)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minimum Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shortage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value at Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-red-600">{item.currentStock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{item.minimumLevel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-red-600">
                        {item.minimumLevel - item.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        ${((item.minimumLevel - item.currentStock) * item.unitPrice).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recent Stock Movements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance After
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(movement.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {movement.type === 'received' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        movement.type === 'received' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.type === 'received' ? 'Received' : 'Issued'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{movement.referenceNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{movement.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{movement.balanceAfter}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{movement.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InventoryReports;