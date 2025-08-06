import React, { useState } from 'react';
import { Appointment, Animal, Owner } from '../../types/consultation';
import { mockAnimals, mockOwners } from '../../data/consultationMockData';
import { mockUsers } from '../../data/mockData';
import Button from '../Common/Button';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import { Save, AlertCircle, Calendar, Clock } from 'lucide-react';

interface AppointmentFormProps {
  appointment?: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, isOpen, onClose, onSave }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  
  const [formData, setFormData] = useState<Partial<Appointment>>({
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '09:00',
    duration: appointment?.duration || 30,
    animalId: appointment?.animalId || '',
    ownerId: appointment?.ownerId || '',
    veterinarianId: appointment?.veterinarianId || '',
    veterinarian: appointment?.veterinarian || '',
    type: appointment?.type || 'Consultation',
    reason: appointment?.reason || '',
    status: appointment?.status || 'Scheduled',
    notes: appointment?.notes || '',
    reminderSent: appointment?.reminderSent || false
  });

  // Load animal and owner data when IDs change
  React.useEffect(() => {
    if (formData.animalId) {
      const animal = mockAnimals.find(a => a.id === formData.animalId);
      setSelectedAnimal(animal || null);
      if (animal) {
        const owner = mockOwners.find(o => o.id === animal.id); // Simplified relationship
        setSelectedOwner(owner || null);
        setFormData(prev => ({ ...prev, ownerId: owner?.id || '' }));
      }
    }
  }, [formData.animalId]);

  React.useEffect(() => {
    if (formData.veterinarianId) {
      const vet = mockUsers.find(u => u.id === formData.veterinarianId);
      if (vet) {
        setFormData(prev => ({ ...prev, veterinarian: vet.name }));
      }
    }
  }, [formData.veterinarianId]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.animalId) newErrors.push('Animal selection is required');
    if (!formData.ownerId) newErrors.push('Owner information is required');
    if (!formData.veterinarianId) newErrors.push('Veterinarian selection is required');
    if (!formData.date) newErrors.push('Date is required');
    if (!formData.time) newErrors.push('Time is required');
    if (!formData.duration || formData.duration <= 0) newErrors.push('Duration must be greater than 0');
    if (!formData.reason?.trim()) newErrors.push('Reason for appointment is required');

    // Check if appointment time is in the past
    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
    if (appointmentDateTime < new Date() && !appointment) {
      newErrors.push('Appointment time cannot be in the past');
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      const updatedFormData = {
        ...formData,
        animal: selectedAnimal!,
        owner: selectedOwner!,
        createdAt: appointment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onSave(updatedFormData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const veterinarians = mockUsers.filter(u => u.role === 'Vet' || u.role === 'Admin');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
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
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Date & Time */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {getTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Patient & Owner Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient & Owner Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animal <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.animalId}
                onChange={(e) => setFormData(prev => ({ ...prev, animalId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Animal</option>
                {mockAnimals.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} ({animal.species} - {animal.breed})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ownerId}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Owner</option>
                {mockOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedAnimal && selectedOwner && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Patient & Owner Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Patient Information</h5>
                  <p><span className="font-medium">Name:</span> {selectedAnimal.name}</p>
                  <p><span className="font-medium">Species:</span> {selectedAnimal.species}</p>
                  <p><span className="font-medium">Breed:</span> {selectedAnimal.breed || 'N/A'}</p>
                  <p><span className="font-medium">Age:</span> {selectedAnimal.age || 'N/A'} years</p>
                  <p><span className="font-medium">Weight:</span> {selectedAnimal.weight || 'N/A'} kg</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Owner Information</h5>
                  <p><span className="font-medium">Name:</span> {selectedOwner.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOwner.phone}</p>
                  <p><span className="font-medium">Email:</span> {selectedOwner.email}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Appointment Details */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterinarian <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.veterinarianId}
                onChange={(e) => setFormData(prev => ({ ...prev, veterinarianId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Veterinarian</option>
                {veterinarians.map(vet => (
                  <option key={vet.id} value={vet.id}>
                    {vet.name} ({vet.role})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Appointment['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Appointment['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.reminderSent}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderSent: e.target.checked }))}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Reminder sent</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Appointment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Brief description of the reason for this appointment..."
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any additional notes or special instructions..."
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" icon={Save}>
            {appointment ? 'Update Appointment' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentForm;