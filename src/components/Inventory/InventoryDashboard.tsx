import React, { useState, useMemo } from 'react';
import { InventoryItem, StockMovement } from '../../types';
import { mockInventory, mockStockMovements } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface InventoryDashboardProps {
  onViewItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onAddItem: () => void;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ 
  onViewItem, 
  onEditItem, 
  onAddItem 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'normal' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'lastUpdated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minimumLevel) return 'low';
    if (item.currentStock >= item.maximumLevel) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
      case 'normal':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = mockInventory.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.shelfNo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filterStatus === 'all') return true;
      return getStockStatus(item) === filterStatus;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'balance':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = mockInventory.length;
    const lowStock = mockInventory.filter(item => getStockStatus(item) === 'low').length;
    const normalStock = mockInventory.filter(item => getStockStatus(item) === 'normal').length;
    const highStock = mockInventory.filter(item => getStockStatus(item) === 'high').length;
    const totalValue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

    return { total, lowStock, normalStock, highStock, totalValue };
  }, []);

  const handleExportPDF = () => {
    // Mock PDF export
    const blob = new Blob(['Mock inventory report'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold">{stats.total}</p>
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
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Normal Stock</p>
              <p className="text-2xl font-bold">{stats.normalStock}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">High Stock</p>
              <p className="text-2xl font-bold">{stats.highStock}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
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
                placeholder="Search items, codes, or shelf numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-80"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
              <option value="high">High Stock</option>
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
              <option value="balance-asc">Balance Low-High</option>
              <option value="balance-desc">Balance High-Low</option>
              <option value="lastUpdated-desc">Recently Updated</option>
              <option value="lastUpdated-asc">Oldest Updated</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleExportPDF} icon={Download} size="sm">
              Export PDF
            </Button>
            <Button onClick={onAddItem} icon={Plus} size="sm">
              Add Item
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Levels
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Balance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedItems.map((item) => {
                const status = getStockStatus(item);
                const stockPercentage = ((item.currentStock - item.minimumLevel) / (item.maximumLevel - item.minimumLevel)) * 100;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Code: <span className="font-mono font-medium">{item.code}</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Unit: {item.unit}
                            </span>
                            {item.shelfNo && (
                              <span className="text-xs text-gray-500">
                                Shelf: {item.shelfNo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Min: {item.minimumLevel}</span>
                          <span>Max: {item.maximumLevel}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              status === 'low' ? 'bg-red-500' :
                              status === 'high' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.max(0, Math.min(100, stockPercentage))}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span>{item.currentStock}</span>
                        </div>
                      </div>
                      {item.reservedStock > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reserved: {item.reservedStock}
                        </p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.currentStock * item.unitPrice).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          @ ${item.unitPrice}/unit
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.lastUpdated).toLocaleTimeString()}
                      </p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => onViewItem(item)}
                          icon={Eye}
                        >
                          View
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => onEditItem(item)}
                          icon={Edit}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Add your first inventory item to get started.'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InventoryDashboard;