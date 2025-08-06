import React, { useState } from 'react';
import { GRN } from '../../types';
import GRNList from './GRNList';
import GRNForm from './GRNForm';
import GRNPreview from './GRNPreview';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { Plus, ArrowLeft } from 'lucide-react';

type View = 'list' | 'create' | 'edit';

const GRNModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null);
  const [previewGRN, setPreviewGRN] = useState<Partial<GRN> | null>(null);
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
    setSelectedGRN(null);
    setCurrentView('create');
  };

  const handleEdit = (grn: GRN) => {
    setSelectedGRN(grn);
    setCurrentView('edit');
  };

  const handleView = (grn: GRN) => {
    setPreviewGRN(grn);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this GRN?')) {
      showToast('success', 'GRN deleted successfully');
    }
  };

  const handleSave = (grn: Partial<GRN>) => {
    showToast('success', 'GRN saved as draft successfully');
  };

  const handlePreview = (grn: Partial<GRN>) => {
    setPreviewGRN(grn);
    setIsPreviewOpen(true);
  };

  const handleSubmit = (grn: Partial<GRN>) => {
    showToast('success', 'GRN submitted successfully');
    setCurrentView('list');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedGRN(null);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'create':
        return 'Create New GRN';
      case 'edit':
        return `Edit GRN ${selectedGRN?.grnNumber}`;
      default:
        return 'Goods Received Notes';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'create':
        return 'Fill in the details for the new goods received note';
      case 'edit':
        return 'Update the goods received note information';
      default:
        return 'Manage incoming inventory with goods received notes';
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
            Create GRN
          </Button>
        )}
      </div>

      {/* Content */}
      {currentView === 'list' && (
        <GRNList
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <GRNForm
          grn={selectedGRN || undefined}
          onSave={handleSave}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
        />
      )}

      {/* Preview Modal */}
      <GRNPreview
        grn={previewGRN}
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

export default GRNModule;