import React, { useState, useMemo } from 'react';
import { InventoryItem, StockMovement } from '../../types';
import { mockStockMovements } from '../../data/mockData';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { 
  Download, 
  Printer, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';

interface BinCardViewProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const BinCardView: React.FC<BinCardViewProps> = ({ item, isOpen, onClose }) => {
  // Early return MUST be before any hooks
  if (!item) return null;

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [movementFilter, setMovementFilter] = useState<'all' | 'received' | 'issued'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const movements = mockStockMovements.filter(movement => movement.itemId === item.id);

  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      const movementDate = new Date(movement.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      const withinDateRange = movementDate >= startDate && movementDate <= endDate;
      const matchesFilter = movementFilter === 'all' || movement.type === movementFilter;
      const matchesSearch = movement.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.remarks.toLowerCase().includes(searchTerm.toLowerCase());
      
      return withinDateRange && matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, dateRange, movementFilter, searchTerm]);

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

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'issued':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const blob = new Blob(['Mock BIN Card PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bin-card-${item.code}-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const status = getStockStatus(item);
  const stockPercentage = ((item.currentStock - item.minimumLevel) / (item.maximumLevel - item.minimumLevel)) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BIN Card View" size="xl">
      <div className="space-y-6">
        {/* Item Header */}
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{item.productName}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">
                    Code: <span className="font-mono font-semibold">{item.code}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    Unit: {item.unit}
                  </span>
                  {item.shelfNo && (
                    <span className="text-sm text-gray-600">
                      Shelf: {item.shelfNo}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
              {status === 'low' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <span className="capitalize">{status} Stock</span>
            </div>
          </div>
        </Card>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{item.currentStock}</div>
            <div className="text-sm text-gray-600">Current Balance</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{item.reservedStock}</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">{item.minimumLevel}</div>
            <div className="text-sm text-gray-600">Minimum Level</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">{item.maximumLevel}</div>
            <div className="text-sm text-gray-600">Maximum Level</div>
          </Card>
        </div>

        {/* Stock Level Indicator */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Level Indicator</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Minimum: {item.minimumLevel}</span>
              <span>Current: {item.currentStock}</span>
              <span>Maximum: {item.maximumLevel}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 relative">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  status === 'low' ? 'bg-red-500' :
                  status === 'high' ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.max(5, Math.min(95, stockPercentage))}%` 
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(stockPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
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
                value={movementFilter}
                onChange={(e) => setMovementFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Movements</option>
                <option value="received">Received Only</option>
                <option value="issued">Issued Only</option>
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search reference or remarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Stock Movement History */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Stock Movement History</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredMovements.length} movements from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement, index) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(movement.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(movement.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getMovementIcon(movement.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movement.referenceNumber}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {movement.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {movement.type === 'received' ? (
                        <span className="text-sm font-medium text-green-600">
                          +{movement.quantity}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {movement.type === 'issued' ? (
                        <span className="text-sm font-medium text-red-600">
                          -{movement.quantity}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-gray-900">
                        {movement.balanceAfter}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {movement.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMovements.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Movements Found</h3>
              <p className="text-gray-600">
                No stock movements found for the selected criteria.
              </p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 print:hidden">
          <Button variant="secondary" onClick={handlePrint} icon={Printer}>
            Print BIN Card
          </Button>
          <Button onClick={handleExportPDF} icon={Download}>
            Export PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BinCardView;