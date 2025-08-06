import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import ReportsDashboard from './ReportsDashboard';
import InventoryReports from './InventoryReports';
import SalesReports from './SalesReports';
import ConsultationReports from './ConsultationReports';
import CustomReports from './CustomReports';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  Stethoscope, 
  Settings,
  TrendingUp
} from 'lucide-react';

type View = 'dashboard' | 'inventory' | 'sales' | 'consultations' | 'custom';

const ReportsModule: React.FC = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  const getTitle = () => {
    switch (currentView) {
      case 'inventory':
        return 'Inventory Reports';
      case 'sales':
        return 'Sales & Financial Reports';
      case 'consultations':
        return 'Consultation Reports';
      case 'custom':
        return 'Custom Reports';
      default:
        return 'Reports & Analytics Dashboard';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'inventory':
        return 'Stock levels, movements, and inventory analytics';
      case 'sales':
        return 'Revenue, sales trends, and financial performance';
      case 'consultations':
        return 'Consultation statistics and veterinary analytics';
      case 'custom':
        return 'Build and customize your own reports';
      default:
        return 'Comprehensive analytics and reporting overview';
    }
  };

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={currentView === 'dashboard' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('dashboard')} 
            icon={TrendingUp}
            size="sm"
          >
            Dashboard
          </Button>
          <Button 
            variant={currentView === 'inventory' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('inventory')} 
            icon={Package}
            size="sm"
          >
            Inventory
          </Button>
          <Button 
            variant={currentView === 'sales' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('sales')} 
            icon={DollarSign}
            size="sm"
          >
            Sales
          </Button>
          <Button 
            variant={currentView === 'consultations' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('consultations')} 
            icon={Stethoscope}
            size="sm"
          >
            Consultations
          </Button>
          <Button 
            variant={currentView === 'custom' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('custom')} 
            icon={Settings}
            size="sm"
          >
            Custom
          </Button>
        </div>
      </div>

      {/* Content */}
      {currentView === 'dashboard' && (
        <ReportsDashboard onNavigate={setCurrentView} />
      )}

      {currentView === 'inventory' && (
        <InventoryReports onShowToast={showToast} />
      )}

      {currentView === 'sales' && (
        <SalesReports onShowToast={showToast} />
      )}

      {currentView === 'consultations' && (
        <ConsultationReports onShowToast={showToast} />
      )}

      {currentView === 'custom' && (
        <CustomReports onShowToast={showToast} />
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

export default ReportsModule;