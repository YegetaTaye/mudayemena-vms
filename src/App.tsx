import React, { useState } from 'react';
import { User } from './types';
import { UserProvider } from './context/UserContext';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import GRNModule from './components/GRN/GRNModule';
import DeliveryModule from './components/Delivery/DeliveryModule';
import InventoryModule from './components/Inventory/InventoryModule';
import UserModule from './components/Users/UserModule';
import ConsultationModule from './components/Consultations/ConsultationModule';
import ReportsModule from './components/Reports/ReportsModule';
import AuditLogsModule from './components/AuditLogs/AuditLogsModule';
import SettingsModule from './components/Settings/SettingsModule';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveModule('dashboard');
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'grn':
        return 'Goods Received Notes';
      case 'delivery':
        return 'Delivery Notes';
      case 'inventory':
        return 'Inventory Management (BIN Card)';
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'User Management';
      case 'consultations':
        return 'Consultations';
      case 'reports':
        return 'Reports & Analytics';
      case 'audit':
        return 'Audit Logs';
      case 'settings':
        return 'System Settings';
      default:
        return 'VetPharm Pro';
    }
  };

  const getModuleSubtitle = () => {
    switch (activeModule) {
      case 'grn':
        return 'Manage incoming inventory and supplier deliveries';
      case 'delivery':
        return 'Manage outgoing deliveries and track shipments';
      case 'inventory':
        return 'Track stock levels, movements, and maintain BIN cards';
      case 'dashboard':
        return 'Overview of your veterinary pharmacy operations';
      case 'users':
        return 'Manage user accounts, roles, and permissions';
      case 'consultations':
        return 'Manage veterinary consultations and appointments';
      case 'reports':
        return 'Generate reports and view analytics';
      case 'audit':
        return 'View system audit trails and compliance logs';
      case 'settings':
        return 'Configure system settings and preferences';
      default:
        return 'Welcome to your veterinary pharmacy management system';
    }
  };

  const getRequiredRoles = (moduleId: string): User['role'][] => {
    switch (moduleId) {
      case 'grn':
      case 'delivery':
        return ['Admin', 'Staff'];
      case 'inventory':
        return ['Admin', 'Staff', 'Vet'];
      case 'consultations':
        return ['Admin', 'Vet'];
      case 'users':
      case 'settings':
        return ['Admin'];
      case 'reports':
      case 'audit':
        return ['Admin', 'Auditor'];
      case 'dashboard':
        return ['Admin', 'Staff', 'Vet', 'Auditor'];
      default:
        return [];
    }
  };

  const renderContent = () => {
    const requiredRoles = getRequiredRoles(activeModule);
    
    const moduleContent = () => {
      switch (activeModule) {
        case 'grn':
          return <GRNModule />;
        case 'delivery':
          return <DeliveryModule />;
        case 'inventory':
          return <InventoryModule />;
        case 'users':
          return <UserModule />;
        case 'consultations':
          return <ConsultationModule />;
        case 'reports':
          return <ReportsModule />;
        case 'audit':
          return <AuditLogsModule />;
        case 'settings':
          return <SettingsModule />;
        case 'dashboard':
          return <Dashboard onNavigateToModule={(moduleId) => setActiveModule(moduleId)} />;
        default:
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Module Coming Soon</h2>
                <p className="text-gray-600">This module is under development.</p>
              </div>
            </div>
          );
      }
    };

    return (
      <ProtectedRoute user={user} requiredRoles={requiredRoles}>
        {moduleContent()}
      </ProtectedRoute>
    );
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar 
            activeItem={activeModule} 
            onItemClick={(itemId) => setActiveModule(itemId)}
            user={user}
            onLogout={handleLogout}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            title={getModuleTitle()} 
            subtitle={getModuleSubtitle()} 
          />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;