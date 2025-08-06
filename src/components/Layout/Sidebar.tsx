import React from 'react';
import { User, NavigationItem } from '../../types';
import Button from '../Common/Button';
import { 
  FileText, 
  Truck, 
  Package, 
  Stethoscope, 
  Users, 
  BarChart3, 
  Settings,
  ClipboardList,
  LogOut,
  Shield
} from 'lucide-react';

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    roles: ['Admin', 'Staff', 'Vet', 'Auditor']
  },
  {
    id: 'grn',
    name: 'Goods Received Note',
    href: '/grn',
    icon: FileText,
    roles: ['Admin', 'Staff'],
    badge: '3'
  },
  {
    id: 'delivery',
    name: 'Delivery Notes',
    href: '/delivery',
    icon: Truck,
    roles: ['Admin', 'Staff']
  },
  {
    id: 'inventory',
    name: 'Inventory (BIN Card)',
    href: '/inventory',
    icon: Package,
    roles: ['Admin', 'Staff', 'Vet']
  },
  {
    id: 'consultations',
    name: 'Consultations',
    href: '/consultations',
    icon: Stethoscope,
    roles: ['Admin', 'Vet']
  },
  {
    id: 'users',
    name: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['Admin']
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3,
    roles: ['Admin', 'Auditor']
  },
  {
    id: 'audit',
    name: 'Audit Logs',
    href: '/audit',
    icon: ClipboardList,
    roles: ['Admin', 'Auditor']
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['Admin']
  }
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, user, onLogout }) => {
  const hasRole = (roles: User['role'][]) => {
    return roles.includes(user.role);
  };

  const filteredItems = navigationItems.filter(item => hasRole(item.roles));

  const getRoleColor = (role: string) => {
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-3 w-3" />;
      case 'Staff':
        return <Users className="h-3 w-3" />;
      case 'Vet':
        return <Stethoscope className="h-3 w-3" />;
      case 'Auditor':
        return <ClipboardList className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-emerald-50">
        <div className="flex items-center">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-md">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">VetPharm Pro</h1>
            <p className="text-xs text-emerald-600 font-medium">Pharmacy Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <img
            src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm border-l-4 border-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <Button
          variant="secondary"
          onClick={onLogout}
          icon={LogOut}
          className="w-full justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          size="sm"
        >
          Sign Out
        </Button>
        
        <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;