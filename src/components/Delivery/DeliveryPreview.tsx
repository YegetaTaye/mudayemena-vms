import React from 'react';
import { DeliveryNote } from '../../types';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { Download, Printer, Truck, MapPin, User, Phone } from 'lucide-react';

interface DeliveryPreviewProps {
  delivery: Partial<DeliveryNote> | null;
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryPreview: React.FC<DeliveryPreviewProps> = ({ delivery, isOpen, onClose }) => {
  if (!delivery) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock PDF download
    const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${delivery.deliveryNumber || 'Delivery'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delivery Note Preview" size="xl">
      <div className="bg-white print:shadow-none">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DELIVERY NOTE</h1>
              <p className="text-gray-600">VetPharm Pro - Veterinary Pharmacy Management System</p>
              <p className="text-sm text-gray-500 mt-1">Professional Veterinary Supply Delivery</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">DN #{delivery.deliveryNumber}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(delivery.status || 'Pending')}`}>
                {delivery.status || 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Recipient Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">Name:</span> {delivery.recipientName}
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">Contact:</span> {delivery.recipientContact}
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-semibold">Address:</span>
                  <p className="text-gray-700 mt-1">{delivery.recipientAddress}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Delivery Details</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Date:</span> {delivery.date ? new Date(delivery.date).toLocaleDateString() : 'Not specified'}</p>
              <p><span className="font-semibold">Total Items:</span> {delivery.items?.length || 0}</p>
              <p><span className="font-semibold">Grand Total:</span> <span className="text-lg font-bold text-emerald-600">${delivery.grandTotal?.toFixed(2) || '0.00'}</span></p>
            </div>
          </div>
        </div>

        {/* Transport Information */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Transport Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">Driver:</span> {delivery.driverName || 'Not assigned'}
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">Vehicle:</span> {delivery.truckPlateNo || 'Not assigned'}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Items for Delivery</h3>
          {delivery.items && delivery.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Item Code</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                    <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Quantity</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Unit Price</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Total Price</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="border border-gray-400 px-3 py-2 text-sm font-mono">{item.code}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.description}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-center font-medium">{item.quantity}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-right font-bold">${item.totalPrice.toFixed(2)}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50">
                  <tr>
                    <td colSpan={4} className="border border-gray-400 px-3 py-3 text-right font-bold text-lg">Grand Total:</td>
                    <td className="border border-gray-400 px-3 py-3 text-right font-bold text-xl text-emerald-700">${delivery.grandTotal?.toFixed(2) || '0.00'}</td>
                    <td className="border border-gray-400"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p>No items to display</p>
            </div>
          )}
        </div>

        {/* Remarks */}
        {delivery.remarks && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Delivery Instructions</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{delivery.remarks}</p>
            </div>
          </div>
        )}

        {/* Approval & Receipt Information */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Approval & Receipt Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Approved By:</p>
              <p className="text-gray-600">{delivery.approvedBy || 'Pending approval'}</p>
              {delivery.approvedDate && (
                <p className="text-xs text-gray-500">Date: {new Date(delivery.approvedDate).toLocaleDateString()}</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Received By:</p>
              <p className="text-gray-600">{delivery.receivedBy || 'Pending receipt'}</p>
              {delivery.receivedDate && (
                <p className="text-xs text-gray-500">Date: {new Date(delivery.receivedDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        {delivery.timestamps && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Delivery Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Created:</p>
                <p className="text-gray-600">{delivery.timestamps.created ? new Date(delivery.timestamps.created).toLocaleString() : 'Not available'}</p>
              </div>
              {delivery.timestamps.approved && (
                <div>
                  <p className="font-semibold text-gray-700">Approved:</p>
                  <p className="text-gray-600">{new Date(delivery.timestamps.approved).toLocaleString()}</p>
                </div>
              )}
              {delivery.timestamps.dispatched && (
                <div>
                  <p className="font-semibold text-gray-700">Dispatched:</p>
                  <p className="text-gray-600">{new Date(delivery.timestamps.dispatched).toLocaleString()}</p>
                </div>
              )}
              {delivery.timestamps.delivered && (
                <div>
                  <p className="font-semibold text-gray-700">Delivered:</p>
                  <p className="text-gray-600">{new Date(delivery.timestamps.delivered).toLocaleString()}</p>
                </div>
              )}
              {delivery.timestamps.confirmed && (
                <div>
                  <p className="font-semibold text-gray-700">Confirmed:</p>
                  <p className="text-gray-600">{new Date(delivery.timestamps.confirmed).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t-2 border-gray-300">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Prepared By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">VetPharm Pro Staff</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Approved By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{delivery.approvedBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Driver:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{delivery.driverName}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Received By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{delivery.receivedBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>This delivery note was generated by VetPharm Pro on {new Date().toLocaleString()}</p>
          <p>© 2024 VetPharm Pro - Professional Veterinary Pharmacy Management System</p>
          <p className="mt-2 font-medium">Please verify all items upon delivery and report any discrepancies immediately.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 print:hidden">
        <Button variant="secondary" onClick={handlePrint} icon={Printer}>
          Print
        </Button>
        <Button onClick={handleDownload} icon={Download}>
          Download PDF
        </Button>
      </div>
    </Modal>
  );
};

export default DeliveryPreview;