import React from 'react';
import { DeliveryNote } from '../../types';
import { mockDeliveryNotes } from '../../data/mockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { Truck, Calendar, User, DollarSign, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle, MapPin, Package } from 'lucide-react';

interface DeliveryListProps {
  onEdit: (delivery: DeliveryNote) => void;
  onView: (delivery: DeliveryNote) => void;
  onDelete: (id: string) => void;
}

const DeliveryList: React.FC<DeliveryListProps> = ({ onEdit, onView, onDelete }) => {
  const getStatusColor = (status: DeliveryNote['status']) => {
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

  const getStatusIcon = (status: DeliveryNote['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'In Transit':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (status: DeliveryNote['status']) => {
    switch (status) {
      case 'Pending':
        return 20;
      case 'Approved':
        return 40;
      case 'In Transit':
        return 70;
      case 'Delivered':
        return 90;
      case 'Confirmed':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {mockDeliveryNotes.map((delivery) => (
        <Card key={delivery.id} className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{delivery.deliveryNumber}</h3>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(delivery.status)}`}>
                  {getStatusIcon(delivery.status)}
                  <span>{delivery.status}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Delivery Progress</span>
                  <span>{getProgressPercentage(delivery.status)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(delivery.status)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{delivery.recipientName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(delivery.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>${delivery.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{delivery.items.length} items</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Delivery Address:</span>
                    <p className="text-gray-600">{delivery.recipientAddress}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="font-medium text-gray-700">Driver:</span> {delivery.driverName || 'Not assigned'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Vehicle:</span> {delivery.truckPlateNo || 'Not assigned'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Contact:</span> {delivery.recipientContact}
                  </div>
                </div>
              </div>
              
              {delivery.remarks && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Remarks:</span>
                  <p className="text-sm text-gray-600 mt-1">{delivery.remarks}</p>
                </div>
              )}

              {/* Approval & Receipt Info */}
              {(delivery.approvedBy || delivery.receivedBy) && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {delivery.approvedBy && (
                      <div>
                        <span className="font-medium text-blue-700">Approved By:</span>
                        <p className="text-blue-600">{delivery.approvedBy}</p>
                        {delivery.approvedDate && (
                          <p className="text-xs text-blue-500">Date: {new Date(delivery.approvedDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    {delivery.receivedBy && (
                      <div>
                        <span className="font-medium text-blue-700">Received By:</span>
                        <p className="text-blue-600">{delivery.receivedBy}</p>
                        {delivery.receivedDate && (
                          <p className="text-xs text-blue-500">Date: {new Date(delivery.receivedDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(delivery.timestamps.created).toLocaleString()}
                  </div>
                  {delivery.timestamps.approved && (
                    <div>
                      <span className="font-medium">Approved:</span> {new Date(delivery.timestamps.approved).toLocaleString()}
                    </div>
                  )}
                  {delivery.timestamps.dispatched && (
                    <div>
                      <span className="font-medium">Dispatched:</span> {new Date(delivery.timestamps.dispatched).toLocaleString()}
                    </div>
                  )}
                  {delivery.timestamps.delivered && (
                    <div>
                      <span className="font-medium">Delivered:</span> {new Date(delivery.timestamps.delivered).toLocaleString()}
                    </div>
                  )}
                  {delivery.timestamps.confirmed && (
                    <div>
                      <span className="font-medium">Confirmed:</span> {new Date(delivery.timestamps.confirmed).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="secondary" size="sm" onClick={() => onView(delivery)} icon={Eye}>
                View
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onEdit(delivery)} icon={Edit}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(delivery.id)} icon={Trash2}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {mockDeliveryNotes.length === 0 && (
        <Card className="text-center py-12">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Delivery Notes Found</h3>
          <p className="text-gray-600">Create your first delivery note to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default DeliveryList;