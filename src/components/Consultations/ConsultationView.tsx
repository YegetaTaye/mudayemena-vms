import React from 'react';
import { Consultation } from '../../types/consultation';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { 
  Download, 
  Printer, 
  Edit, 
  Stethoscope, 
  User, 
  Calendar, 
  Clock,
  FileText,
  Pill,
  DollarSign,
  Phone,
  Mail
} from 'lucide-react';

interface ConsultationViewProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ consultation, isOpen, onClose, onEdit }) => {
  if (!consultation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob(['Mock consultation report'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${consultation.consultationNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Consultation Record" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{consultation.consultationNumber}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(consultation.status)}`}>
                    <span>{consultation.status}</span>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(consultation.paymentStatus)}`}>
                    <span>Payment: {consultation.paymentStatus}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(consultation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{consultation.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Dr. {consultation.veterinarian}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={handlePrint} icon={Printer} size="sm">
                Print
              </Button>
              <Button variant="secondary" onClick={handleDownload} icon={Download} size="sm">
                Download
              </Button>
              <Button onClick={onEdit} icon={Edit} size="sm">
                Edit
              </Button>
            </div>
          </div>
        </Card>

        {/* Patient & Owner Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Species:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.species}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Breed:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.breed || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Age:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.age || 'Not specified'} years</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Weight:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.weight || 'Not specified'} kg</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Gender:</span>
                <span className="ml-2 text-gray-900">{consultation.animal.gender}</span>
              </div>
              {consultation.animal.microchipId && (
                <div>
                  <span className="font-medium text-gray-700">Microchip ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{consultation.animal.microchipId}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{consultation.owner.name}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-900">{consultation.owner.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{consultation.owner.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="mt-1 text-gray-900">{consultation.owner.address}</p>
              </div>
              {consultation.owner.emergencyContact && (
                <div>
                  <span className="font-medium text-gray-700">Emergency Contact:</span>
                  <span className="ml-2 text-gray-900">{consultation.owner.emergencyContact}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Clinical Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Chief Complaint</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{consultation.chiefComplaint}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Clinical Findings</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{consultation.clinicalFindings}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
              <p className="text-gray-900 bg-emerald-50 p-3 rounded-lg border border-emerald-200">{consultation.diagnosis}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Treatment Plan</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{consultation.treatment}</p>
            </div>
          </div>
        </Card>

        {/* Prescriptions */}
        {consultation.prescriptions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescriptions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Medication</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Dosage</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Frequency</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {consultation.prescriptions.map((prescription, index) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Pill className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">{prescription.productName}</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{prescription.dosage}</td>
                      <td className="border border-gray-300 px-4 py-2">{prescription.frequency}</td>
                      <td className="border border-gray-300 px-4 py-2">{prescription.duration}</td>
                      
                      <td className="border border-gray-300 px-4 py-2 text-center">{prescription.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-medium">${prescription.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                  {consultation.prescriptions.map((prescription, index) => (
                    prescription.instructions && (
                      <tr key={`instructions-${index}`}>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600" colSpan={6}>
                          <strong>Instructions:</strong> {prescription.instructions}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50">
                  <tr>
                    <td colSpan={5} className="border border-gray-300 px-4 py-3 text-right font-bold">Total Prescription Cost:</td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-emerald-700">
                      ${consultation.prescriptions.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}

        {/* Follow-up & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultation.followUpDate && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Follow-up Date:</span>
                  <span className="ml-2 text-gray-900">{new Date(consultation.followUpDate).toLocaleDateString()}</span>
                </div>
                {consultation.followUpNotes && (
                  <div>
                    <span className="font-medium text-gray-700">Follow-up Notes:</span>
                    <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{consultation.followUpNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Consultation Fee:</span>
                <span className="text-gray-900">
                  ${(consultation.totalCost - consultation.prescriptions.reduce((sum, p) => sum + p.totalPrice, 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Prescriptions:</span>
                <span className="text-gray-900">
                  ${consultation.prescriptions.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total Cost:</span>
                <span className="font-bold text-emerald-600 text-lg">${consultation.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Payment Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(consultation.paymentStatus)}`}>
                  {consultation.paymentStatus}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Notes */}
        {consultation.notes && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{consultation.notes}</p>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Scheduled:</span>
              <p className="text-gray-900">{new Date(consultation.timestamps.scheduled).toLocaleString()}</p>
            </div>
            {consultation.timestamps.started && (
              <div>
                <span className="font-medium text-gray-700">Started:</span>
                <p className="text-gray-900">{new Date(consultation.timestamps.started).toLocaleString()}</p>
              </div>
            )}
            {consultation.timestamps.completed && (
              <div>
                <span className="font-medium text-gray-700">Completed:</span>
                <p className="text-gray-900">{new Date(consultation.timestamps.completed).toLocaleString()}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>This consultation record was generated by VetPharm Pro on {new Date().toLocaleString()}</p>
          <p>© 2024 VetPharm Pro - Professional Veterinary Consultation Management</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConsultationView;