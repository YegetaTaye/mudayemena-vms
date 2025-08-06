import React, { useState } from 'react';
import { InventoryItem, ValidationError } from '../../types';
import { mockProducts } from '../../data/mockData';
import Button from '../Common/Button';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import { Save, AlertCircle, Package } from 'lucide-react';

interface InventoryFormProps {
  item?: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, isOpen, onClose, onSave }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    productId: item?.productId || '',
    productName: item?.productName || '',
    code: item?.code || '',
    unit: item?.unit || '',
    currentStock: item?.currentStock || 0,
    reservedStock: item?.reservedStock || 0,
    minimumLevel: item?.minimumLevel || 10,
    maximumLevel: item?.maximumLevel || 100,
    unitPrice: item?.unitPrice || 0,
    shelfNo: item?.shelfNo || '',
    category: item?.category || '',
    description: item?.description || ''
  });

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    if (!formData.productName?.trim()) {
      newErrors.push({ field: 'productName', message: 'Product Name is required' });
    }
    if (!formData.code?.trim()) {
      newErrors.push({ field: 'code', message: 'Product Code is required' });
    }
    if (!formData.unit?.trim()) {
      newErrors.push({ field: 'unit', message: 'Unit is required' });
    }
    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.push({ field: 'unitPrice', message: 'Unit Price must be greater than 0' });
    }
    if (!formData.minimumLevel || formData.minimumLevel < 0) {
      newErrors.push({ field: 'minimumLevel', message: 'Minimum Level must be 0 or greater' });
    }
    if (!formData.maximumLevel || formData.maximumLevel <= 0) {
      newErrors.push({ field: 'maximumLevel', message: 'Maximum Level must be greater than 0' });
    }
    if (formData.minimumLevel && formData.maximumLevel && formData.minimumLevel >= formData.maximumLevel) {
      newErrors.push({ field: 'maximumLevel', message: 'Maximum Level must be greater than Minimum Level' });
    }
    if (formData.currentStock && formData.currentStock < 0) {
      newErrors.push({ field: 'currentStock', message: 'Current Stock cannot be negative' });
    }
    if (formData.reservedStock && formData.reservedStock < 0) {
      newErrors.push({ field: 'reservedStock', message: 'Reserved Stock cannot be negative' });
    }

    return newErrors;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const handleProductChange = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: product.id,
        productName: product.name,
        code: product.code,
        unit: product.unit,
        category: product.category,
        description: product.description
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      const updatedFormData = {
        ...formData,
        availableStock: (formData.currentStock || 0) - (formData.reservedStock || 0),
        lastUpdated: new Date().toISOString()
      };
      onSave(updatedFormData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Product Selection */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('productName') ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a product</option>
                {mockProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.code})
                  </option>
                ))}
              </select>
              {getFieldError('productName') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('productName')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('code') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product code"
              />
              {getFieldError('code') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('code')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('productName') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {getFieldError('productName') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('productName')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('unit') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Tablets, ml, Bottles"
              />
              {getFieldError('unit') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('unit')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Antibiotics, Pain Relief"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Number</label>
              <input
                type="text"
                value={formData.shelfNo}
                onChange={(e) => setFormData(prev => ({ ...prev, shelfNo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., A1, B2-3"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Product description"
            />
          </div>
        </Card>

        {/* Stock Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('currentStock') ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
              />
              {getFieldError('currentStock') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('currentStock')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reserved Stock
              </label>
              <input
                type="number"
                value={formData.reservedStock}
                onChange={(e) => setFormData(prev => ({ ...prev, reservedStock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('reservedStock') ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
              />
              {getFieldError('reservedStock') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('reservedStock')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Stock
              </label>
              <input
                type="number"
                value={(formData.currentStock || 0) - (formData.reservedStock || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Calculated automatically</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minimumLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumLevel: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('minimumLevel') ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
              />
              {getFieldError('minimumLevel') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('minimumLevel')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.maximumLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, maximumLevel: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('maximumLevel') ? 'border-red-300' : 'border-gray-300'
                }`}
                min="1"
              />
              {getFieldError('maximumLevel') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('maximumLevel')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getFieldError('unitPrice') ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0.01"
              />
              {getFieldError('unitPrice') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('unitPrice')}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" icon={Save}>
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryForm;