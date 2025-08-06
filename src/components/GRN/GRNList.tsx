import React from 'react';
import { GRN } from '../../types';
import { mockGRNs } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { FileText, Calendar, User, DollarSign, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface GRNListProps {
  onEdit: (grn: GRN) => void;
  onView: (grn: GRN) => void;
  onDelete: (id: string) => void;
}

const GRNList: React.FC<GRNListProps> = ({ onEdit, onView, onDelete }) => {
  const getStatusColor = (status: GRN['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Checked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Received':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: GRN['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Checked':
        return <AlertCircle className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Received':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (status: GRN['status']) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'Checked':
        return 50;
      case 'Approved':
        return 75;
      case 'Received':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {mockGRNs.map((grn) => (
        <Card key={grn.id} className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{grn.grnNumber}</h3>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(grn.status)}`}>
                  {getStatusIcon(grn.status)}
                  <span>{grn.status}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{getProgressPercentage(grn.status)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(grn.status)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{grn.supplierName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(grn.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>${grn.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{grn.items.length} items</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Invoice:</span> {grn.invoiceNumber}
                </div>
                <div>
                  <span className="font-medium text-gray-700">PR Number:</span> {grn.prRequisitionNumber}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Received By:</span> {grn.receivedBy}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Delivered By:</span> {grn.deliveredBy || 'Not specified'}
                </div>
              </div>
              
              {grn.remarks && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Remarks:</span>
                  <p className="text-sm text-gray-600 mt-1">{grn.remarks}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(grn.timestamps.created).toLocaleString()}
                  </div>
                  {grn.timestamps.checked && (
                    <div>
                      <span className="font-medium">Checked:</span> {new Date(grn.timestamps.checked).toLocaleString()}
                    </div>
                  )}
                  {grn.timestamps.approved && (
                    <div>
                      <span className="font-medium">Approved:</span> {new Date(grn.timestamps.approved).toLocaleString()}
                    </div>
                  )}
                  {grn.timestamps.received && (
                    <div>
                      <span className="font-medium">Received:</span> {new Date(grn.timestamps.received).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="secondary" size="sm" onClick={() => onView(grn)} icon={Eye}>
                View
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onEdit(grn)} icon={Edit}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(grn.id)} icon={Trash2}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {mockGRNs.length === 0 && (
        <Card className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No GRNs Found</h3>
          <p className="text-gray-600">Create your first Goods Received Note to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default GRNList;