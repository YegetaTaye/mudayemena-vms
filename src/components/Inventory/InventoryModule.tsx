import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import InventoryDashboard from './InventoryDashboard';
import BinCardView from './BinCardView';
import InventoryForm from './InventoryForm';
import Toast from '../Common/Toast';

const InventoryModule: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isBinCardOpen, setIsBinCardOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsBinCardOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleSaveItem = (item: Partial<InventoryItem>) => {
    if (editingItem) {
      showToast('success', 'Inventory item updated successfully');
    } else {
      showToast('success', 'New inventory item added successfully');
    }
    setEditingItem(null);
  };

  const handleCloseBinCard = () => {
    setIsBinCardOpen(false);
    setSelectedItem(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Main Dashboard */}
      <InventoryDashboard
        onViewItem={handleViewItem}
        onEditItem={handleEditItem}
        onAddItem={handleAddItem}
      />

      {/* BIN Card Modal */}
      <BinCardView
        item={selectedItem}
        isOpen={isBinCardOpen}
        onClose={handleCloseBinCard}
      />

      {/* Inventory Form Modal */}
      <InventoryForm
        item={editingItem || undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveItem}
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

export default InventoryModule;