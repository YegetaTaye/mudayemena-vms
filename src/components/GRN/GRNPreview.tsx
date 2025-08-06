import React from 'react';
import { GRN } from '../../types';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { Download, Printer, FileText } from 'lucide-react';

interface GRNPreviewProps {
  grn: Partial<GRN> | null;
  isOpen: boolean;
  onClose: () => void;
}

const GRNPreview: React.FC<GRNPreviewProps> = ({ grn, isOpen, onClose }) => {
  if (!grn) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock PDF download
    const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${grn.grnNumber || 'GRN'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
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
    <Modal isOpen={isOpen} onClose={onClose} title="GRN Preview" size="xl">
      <div className="bg-white print:shadow-none">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GOODS RECEIVED NOTE</h1>
              <p className="text-gray-600">VetPharm Pro - Veterinary Pharmacy Management System</p>
              <p className="text-sm text-gray-500 mt-1">Professional Veterinary Supply Management</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">GRN #{grn.grnNumber}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(grn.status || 'Pending')}`}>
                {grn.status || 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Document Information */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Supplier Information</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Supplier:</span> {grn.supplierName}</p>
              <p><span className="font-semibold">Invoice Number:</span> {grn.invoiceNumber}</p>
              <p><span className="font-semibold">PR Requisition:</span> {grn.prRequisitionNumber}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Document Details</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Date:</span> {grn.date ? new Date(grn.date).toLocaleDateString() : 'Not specified'}</p>
              <p><span className="font-semibold">Total Items:</span> {grn.items?.length || 0}</p>
              <p><span className="font-semibold">Grand Total:</span> <span className="text-lg font-bold text-emerald-600">${grn.grandTotal?.toFixed(2) || '0.00'}</span></p>
            </div>
          </div>
        </div>

        {/* Personnel Information */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Personnel Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold text-gray-700">Received By:</p>
              <p className="text-gray-900">{grn.receivedBy || 'Not assigned'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Checked By:</p>
              <p className="text-gray-900">{grn.checkedBy || 'Pending'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Approved By:</p>
              <p className="text-gray-900">{grn.approvedBy || 'Pending'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Delivered By:</p>
              <p className="text-gray-900">{grn.deliveredBy || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Items Received</h3>
          {grn.items && grn.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Item ID</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                    <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold text-gray-700 uppercase">Quantity</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Unit Price</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Batch #</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Expiry Date</th>
                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Code</th>
                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {grn.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.itemId || '-'}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.description}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-center font-medium">{item.quantity}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.batchNumber}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{item.expirationDate}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm font-mono">{item.code}</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm text-right font-bold">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                  {grn.items.map((item, index) => (
                    item.remarks && (
                      <tr key={`remarks-${index}`}>
                        <td className="border border-gray-400 px-3 py-1 text-xs text-gray-600" colSpan={2}>
                          <strong>Remarks:</strong> {item.remarks}
                        </td>
                        <td className="border border-gray-400" colSpan={6}></td>
                      </tr>
                    )
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50">
                  <tr>
                    <td colSpan={7} className="border border-gray-400 px-3 py-3 text-right font-bold text-lg">Grand Total:</td>
                    <td className="border border-gray-400 px-3 py-3 text-right font-bold text-xl text-emerald-700">${grn.grandTotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p>No items to display</p>
            </div>
          )}
        </div>

        {/* Remarks */}
        {grn.remarks && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">General Remarks</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{grn.remarks}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        {grn.timestamps && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-200 pb-1">Document Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Created:</p>
                <p className="text-gray-600">{grn.timestamps.created ? new Date(grn.timestamps.created).toLocaleString() : 'Not available'}</p>
              </div>
              {grn.timestamps.checked && (
                <div>
                  <p className="font-semibold text-gray-700">Checked:</p>
                  <p className="text-gray-600">{new Date(grn.timestamps.checked).toLocaleString()}</p>
                </div>
              )}
              {grn.timestamps.approved && (
                <div>
                  <p className="font-semibold text-gray-700">Approved:</p>
                  <p className="text-gray-600">{new Date(grn.timestamps.approved).toLocaleString()}</p>
                </div>
              )}
              {grn.timestamps.received && (
                <div>
                  <p className="font-semibold text-gray-700">Received:</p>
                  <p className="text-gray-600">{new Date(grn.timestamps.received).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t-2 border-gray-300">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Received By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{grn.receivedBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Checked By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{grn.checkedBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Approved By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{grn.approvedBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-4">Delivered By:</p>
            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-12 flex items-end">
              <p className="text-sm text-gray-700">{grn.deliveredBy}</p>
            </div>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>This document was generated by VetPharm Pro on {new Date().toLocaleString()}</p>
          <p>© 2024 VetPharm Pro - Professional Veterinary Pharmacy Management System</p>
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

export default GRNPreview;