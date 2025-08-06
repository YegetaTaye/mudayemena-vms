import React, { useState } from 'react';
import { User } from '../../types';
import UserList from './UserList';
import UserForm from './UserForm';
import UserProfile from './UserProfile';
import ActivityLog from './ActivityLog';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { useUser } from '../../context/UserContext';
import { Plus, ArrowLeft, Activity, Users } from 'lucide-react';

type View = 'list' | 'create' | 'edit' | 'profile' | 'activity';

const UserModule: React.FC = () => {
  const { user: currentUser } = useUser();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      showToast('success', 'User deleted successfully');
    }
  };

  const handleToggleStatus = (id: string) => {
    showToast('success', 'User status updated successfully');
  };

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      showToast('success', 'User updated successfully');
    } else {
      showToast('success', 'New user created successfully');
    }
    setSelectedUser(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedUser(null);
  };

  const handleEditFromProfile = () => {
    setIsProfileOpen(false);
    setIsFormOpen(true);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'activity':
        return 'Activity Logs';
      default:
        return 'User Management';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'activity':
        return 'Monitor user activities and system access logs';
      default:
        return 'Manage user accounts, roles, and permissions';
    }
  };

  if (!currentUser) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant={currentView === 'list' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('list')} 
            icon={Users}
            size="sm"
          >
            Users
          </Button>
          <Button 
            variant={currentView === 'activity' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('activity')} 
            icon={Activity}
            size="sm"
          >
            Activity Log
          </Button>
          {currentView === 'list' && (
            <Button onClick={handleAddUser} icon={Plus}>
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {currentView === 'list' && (
        <UserList
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {currentView === 'activity' && (
        <ActivityLog currentUser={currentUser} />
      )}

      {/* User Form Modal */}
      <UserForm
        user={selectedUser || undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
      />

      {/* User Profile Modal */}
      <UserProfile
        user={selectedUser}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        onEdit={handleEditFromProfile}
      />

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

export default UserModule;