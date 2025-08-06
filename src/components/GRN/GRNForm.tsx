import React, { useState, useEffect } from 'react';
import { GRN, GRNItem, Supplier, Product, ValidationError } from '../../types';
import { mockSuppliers, mockProducts, mockUsers } from '../../data/mockData';
import { useUser } from '../../context/UserContext';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { Plus, Trash2, Save, Eye, Send, AlertCircle } from 'lucide-react';

interface GRNFormProps {
  grn?: GRN;
  onSave: (grn: Partial<GRN>) => void;
  onPreview: (grn: Partial<GRN>) => void;
  onSubmit: (grn: Partial<GRN>) => void;
}

const GRNForm: React.FC<GRNFormProps> = ({ grn, onSave, onPreview, onSubmit }) => {
  const { user } = useUser();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState<Partial<GRN>>({
    grnNumber: grn?.grnNumber || `GRN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    supplierName: grn?.supplierName || '',
    invoiceNumber: grn?.invoiceNumber || '',
    prRequisitionNumber: grn?.prRequisitionNumber || '',
    date: grn?.date || new Date().toISOString().split('T')[0],
    items: grn?.items || [],
    grandTotal: grn?.grandTotal || 0,
    receivedBy: grn?.receivedBy || user.name,
    checkedBy: grn?.checkedBy || '',
    approvedBy: grn?.approvedBy || '',
    deliveredBy: grn?.deliveredBy || '',
    status: grn?.status || 'Pending',
    remarks: grn?.remarks || '',
    timestamps: grn?.timestamps || {
      created: new Date().toISOString()
    }
  });

  // Auto-calculate grand total when items change
  useEffect(() => {
    const total = (formData.items || []).reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({ ...prev, grandTotal: total }));
  }, [formData.items]);

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    // Required field validations
    if (!formData.supplierName?.trim()) {
      newErrors.push({ field: 'supplierName', message: 'Supplier Name is required' });
    }
    if (!formData.invoiceNumber?.trim()) {
      newErrors.push({ field: 'invoiceNumber', message: 'Invoice Number is required' });
    }
    if (!formData.prRequisitionNumber?.trim()) {
      newErrors.push({ field: 'prRequisitionNumber', message: 'PR Requisition Number is required' });
    }
    if (!formData.date) {
      newErrors.push({ field: 'date', message: 'Date is required' });
    }
    if (!formData.items || formData.items.length === 0) {
      newErrors.push({ field: 'items', message: 'At least one item is required' });
    }

    // Item validations
    formData.items?.forEach((item, index) => {
      if (!item.description?.trim()) {
        newErrors.push({ field: `items.${index}.description`, message: `Item ${index + 1}: Description is required` });
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors.push({ field: `items.${index}.quantity`, message: `Item ${index + 1}: Quantity must be greater than 0` });
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        newErrors.push({ field: `items.${index}.unitPrice`, message: `Item ${index + 1}: Unit Price must be greater than 0` });
      }
      if (!item.batchNumber?.trim()) {
        newErrors.push({ field: `items.${index}.batchNumber`, message: `Item ${index + 1}: Batch Number is required` });
      }
      if (!item.expirationDate) {
        newErrors.push({ field: `items.${index}.expirationDate`, message: `Item ${index + 1}: Expiration Date is required` });
      }
    });

    return newErrors;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const addItem = () => {
    const newItem: GRNItem = {
      id: String(Date.now()),
      itemId: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      batchNumber: '',
      expirationDate: '',
      code: '',
      remarks: '',
      totalPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const updateItem = (index: number, field: keyof GRNItem, value: any) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    // Auto-fill product details when item is selected
    if (field === 'itemId') {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        updatedItems[index].description = product.description;
        updatedItems[index].code = product.code;
      }
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      onSave(formData);
    }
  };

  const handlePreview = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      onPreview(formData);
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      const updatedFormData = {
        ...formData,
        status: 'Checked' as const,
        timestamps: {
          ...formData.timestamps,
          checked: new Date().toISOString()
        }
      };
      onSubmit(updatedFormData);
    }
  };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">GRN Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(formData.status || 'Pending')}`}>
              {formData.status || 'Pending'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Created: {formData.timestamps?.created ? new Date(formData.timestamps.created).toLocaleString() : 'Not saved'}
          </div>
        </div>
      </Card>

      {/* Error Summary */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Header Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GRN Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GRN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.grnNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, grnNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.supplierName}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getFieldError('supplierName') ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Supplier</option>
              {mockSuppliers.map(supplier => (
                <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
              ))}
            </select>
            {getFieldError('supplierName') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('supplierName')}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getFieldError('invoiceNumber') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="INV-2024-001"
            />
            {getFieldError('invoiceNumber') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('invoiceNumber')}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Requisition Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prRequisitionNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, prRequisitionNumber: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getFieldError('prRequisitionNumber') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="PR-2024-001"
            />
            {getFieldError('prRequisitionNumber') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('prRequisitionNumber')}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getFieldError('date') ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {getFieldError('date') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('date')}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Personnel Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Received By</label>
            <select
              value={formData.receivedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Person</option>
              {mockUsers.filter(u => u.role === 'Staff' || u.role === 'Admin').map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Checked By</label>
            <select
              value={formData.checkedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, checkedBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Person</option>
              {mockUsers.filter(u => u.role === 'Vet' || u.role === 'Admin').map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
            <select
              value={formData.approvedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, approvedBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Person</option>
              {mockUsers.filter(u => u.role === 'Admin').map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivered By</label>
            <input
              type="text"
              value={formData.deliveredBy}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveredBy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Delivery service or person"
            />
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Items <span className="text-red-500">*</span>
          </h3>
          <Button onClick={addItem} icon={Plus} size="sm">
            Add Item
          </Button>
        </div>
        
        {getFieldError('items') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{getFieldError('items')}</p>
          </div>
        )}
        
        {formData.items && formData.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Item</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Unit Price</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Batch #</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Expiry</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Code</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <select
                        value={item.itemId}
                        onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.description`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Item</option>
                        {mockProducts.map(product => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.description`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-20 px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.quantity`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="1"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-24 px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.unitPrice`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="0.01"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={item.batchNumber}
                        onChange={(e) => updateItem(index, 'batchNumber', e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.batchNumber`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Batch #"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="date"
                        value={item.expirationDate}
                        onChange={(e) => updateItem(index, 'expirationDate', e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-emerald-500 ${
                          getFieldError(`items.${index}.expirationDate`) ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => updateItem(index, 'code', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500"
                        placeholder="Code"
                      />
                    </td>
                    <td className="py-3 px-2 font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet. Click "Add Item" to get started.</p>
          </div>
        )}
        
        {formData.items && formData.items.length > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="bg-emerald-50 px-6 py-4 rounded-lg border border-emerald-200">
              <div className="text-xl font-bold text-emerald-800">
                Grand Total: ${formData.grandTotal?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Remarks */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Add any additional notes, special handling instructions, or observations..."
        />
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={handleSave} icon={Save}>
          Save Draft
        </Button>
        <Button variant="secondary" onClick={handlePreview} icon={Eye}>
          Preview
        </Button>
        <Button onClick={handleSubmit} icon={Send}>
          Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default GRNForm;