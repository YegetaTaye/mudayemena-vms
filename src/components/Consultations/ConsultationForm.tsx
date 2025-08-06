import React, { useState, useEffect } from 'react';
import { Consultation, PrescriptionItem, Animal, Owner } from '../../types/consultation';
import { mockAnimals, mockOwners, mockConsultationTemplates } from '../../data/consultationMockData';
import { mockProducts, mockInventory } from '../../data/mockData';
import { useUser } from '../../context/UserContext';
import Button from '../Common/Button';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import { Save, AlertCircle, Plus, Trash2, Search, FileText } from 'lucide-react';

interface ConsultationFormProps {
  consultation?: Consultation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (consultation: Partial<Consultation>) => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ consultation, isOpen, onClose, onSave }) => {
  const { user } = useUser();
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  
  const [formData, setFormData] = useState<Partial<Consultation>>({
    consultationNumber: consultation?.consultationNumber || `CON-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: consultation?.date || new Date().toISOString().split('T')[0],
    time: consultation?.time || new Date().toTimeString().slice(0, 5),
    animalId: consultation?.animalId || '',
    ownerId: consultation?.ownerId || '',
    veterinarianId: consultation?.veterinarianId || user?.id || '',
    veterinarian: consultation?.veterinarian || user?.name || '',
    chiefComplaint: consultation?.chiefComplaint || '',
    clinicalFindings: consultation?.clinicalFindings || '',
    diagnosis: consultation?.diagnosis || '',
    treatment: consultation?.treatment || '',
    prescriptions: consultation?.prescriptions || [],
    followUpDate: consultation?.followUpDate || '',
    followUpNotes: consultation?.followUpNotes || '',
    status: consultation?.status || 'Scheduled',
    totalCost: consultation?.totalCost || 0,
    paymentStatus: consultation?.paymentStatus || 'Pending',
    notes: consultation?.notes || ''
  });

  // Auto-calculate total cost when prescriptions change
  useEffect(() => {
    const total = (formData.prescriptions || []).reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({ ...prev, totalCost: total }));
  }, [formData.prescriptions]);

  // Load animal and owner data when IDs change
  useEffect(() => {
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

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!formData.animalId) newErrors.push('Animal selection is required');
    if (!formData.ownerId) newErrors.push('Owner information is required');
    if (!formData.date) newErrors.push('Date is required');
    if (!formData.time) newErrors.push('Time is required');
    if (!formData.chiefComplaint?.trim()) newErrors.push('Chief complaint is required');
    if (!formData.diagnosis?.trim()) newErrors.push('Diagnosis is required');
    if (!formData.treatment?.trim()) newErrors.push('Treatment is required');

    return newErrors;
  };

  const addPrescription = () => {
    const newPrescription: PrescriptionItem = {
      id: String(Date.now()),
      productId: '',
      productName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      instructions: '',
      unitPrice: 0,
      totalPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      prescriptions: [...(prev.prescriptions || []), newPrescription]
    }));
  };

  const updatePrescription = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updatedPrescriptions = [...(formData.prescriptions || [])];
    updatedPrescriptions[index] = { ...updatedPrescriptions[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      updatedPrescriptions[index].totalPrice = updatedPrescriptions[index].quantity * updatedPrescriptions[index].unitPrice;
    }
    
    // Auto-fill product details when product is selected
    if (field === 'productId') {
      const product = mockProducts.find(p => p.id === value);
      const inventory = mockInventory.find(i => i.productId === value);
      if (product && inventory) {
        updatedPrescriptions[index].productName = product.name;
        updatedPrescriptions[index].unitPrice = inventory.unitPrice;
      }
    }
    
    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  const removePrescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = mockConsultationTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        chiefComplaint: template.chiefComplaint,
        clinicalFindings: template.clinicalFindings,
        diagnosis: template.diagnosis,
        treatment: template.treatment,
        prescriptions: template.commonPrescriptions.map(p => ({
          ...p,
          id: String(Date.now() + Math.random())
        }))
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
        animal: selectedAnimal!,
        owner: selectedOwner!,
        timestamps: consultation?.timestamps || {
          scheduled: new Date().toISOString()
        }
      };
      onSave(updatedFormData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  const availableTemplates = mockConsultationTemplates.filter(t => 
    t.isActive && (!selectedAnimal || t.species === selectedAnimal.species)
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={consultation ? 'Edit Consultation' : 'New Consultation'}
      size="xl"
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

        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Number
              </label>
              <input
                type="text"
                value={formData.consultationNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
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

          {selectedAnimal && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Patient Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Species:</span> {selectedAnimal.species}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Breed:</span> {selectedAnimal.breed || 'N/A'}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Age:</span> {selectedAnimal.age || 'N/A'} years
                </div>
                <div>
                  <span className="font-medium text-gray-700">Weight:</span> {selectedAnimal.weight || 'N/A'} kg
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Templates */}
        {availableTemplates.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{template.category}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Clinical Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chief Complaint <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.chiefComplaint}
                onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Primary reason for the visit..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinical Findings
              </label>
              <textarea
                value={formData.clinicalFindings}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicalFindings: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Physical examination findings..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Primary and secondary diagnoses..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Plan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.treatment}
                onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Treatment plan and recommendations..."
              />
            </div>
          </div>
        </Card>

        {/* Prescriptions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
            <Button onClick={addPrescription} icon={Plus} size="sm" type="button">
              Add Prescription
            </Button>
          </div>
          
          {formData.prescriptions && formData.prescriptions.length > 0 ? (
            <div className="space-y-4">
              {formData.prescriptions.map((prescription, index) => (
                <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                      <select
                        value={prescription.productId}
                        onChange={(e) => updatePrescription(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select Product</option>
                        {mockProducts.map(product => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={prescription.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={prescription.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Twice daily"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={prescription.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={prescription.quantity}
                        onChange={(e) => updatePrescription(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        min="1"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                          ${prescription.totalPrice.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      value={prescription.instructions}
                      onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Special instructions for administration..."
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <div className="bg-emerald-50 px-6 py-4 rounded-lg border border-emerald-200">
                  <div className="text-xl font-bold text-emerald-800">
                    Total Cost: ${formData.totalCost?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No prescriptions added yet. Click "Add Prescription" to get started.</p>
            </div>
          )}
        </Card>

        {/* Follow-up & Notes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up & Additional Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Consultation['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
            <textarea
              value={formData.followUpNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpNotes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Notes for follow-up appointment..."
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any additional notes or observations..."
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" icon={Save}>
            {consultation ? 'Update Consultation' : 'Save Consultation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConsultationForm;