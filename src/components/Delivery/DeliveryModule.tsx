import React, { useState } from 'react';
import { DeliveryNote } from '../../types';
import DeliveryList from './DeliveryList';
import DeliveryForm from './DeliveryForm';
import DeliveryPreview from './DeliveryPreview';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { Plus, ArrowLeft } from 'lucide-react';

type View = 'list' | 'create' | 'edit';

const DeliveryModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryNote | null>(null);
  const [previewDelivery, setPreviewDelivery] = useState<Partial<DeliveryNote> | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  const handleCreate = () => {
    setSelectedDelivery(null);
    setCurrentView('create');
  };

  const handleEdit = (delivery: DeliveryNote) => {
    setSelectedDelivery(delivery);
    setCurrentView('edit');
  };

  const handleView = (delivery: DeliveryNote) => {
    setPreviewDelivery(delivery);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery note?')) {
      showToast('success', 'Delivery note deleted successfully');
    }
  };

  const handleSave = (delivery: Partial<DeliveryNote>) => {
    showToast('success', 'Delivery note saved as draft successfully');
  };

  const handlePreview = (delivery: Partial<DeliveryNote>) => {
    setPreviewDelivery(delivery);
    setIsPreviewOpen(true);
  };

  const handleSubmit = (delivery: Partial<DeliveryNote>) => {
    showToast('success', 'Delivery note submitted for approval successfully');
    setCurrentView('list');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedDelivery(null);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'create':
        return 'Create New Delivery Note';
      case 'edit':
        return `Edit Delivery Note ${selectedDelivery?.deliveryNumber}`;
      default:
        return 'Delivery Notes';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'create':
        return 'Fill in the details for the new delivery note';
      case 'edit':
        return 'Update the delivery note information';
      default:
        return 'Manage outgoing deliveries and track shipments';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentView !== 'list' && (
            <Button variant="secondary" onClick={handleBack} icon={ArrowLeft} size="sm">
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
          </div>
        </div>
        
        {currentView === 'list' && (
          <Button onClick={handleCreate} icon={Plus}>
            Create Delivery Note
          </Button>
        )}
      </div>

      {/* Content */}
      {currentView === 'list' && (
        <DeliveryList
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <DeliveryForm
          delivery={selectedDelivery || undefined}
          onSave={handleSave}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
        />
      )}

      {/* Preview Modal */}
      <DeliveryPreview
        delivery={previewDelivery}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Toast */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default DeliveryModule;