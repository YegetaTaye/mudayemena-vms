export interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender: 'Male' | 'Female';
  microchipId?: string;
  notes?: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact?: string;
}

export interface PrescriptionItem {
  id: string;
  productId: string;
  productName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Consultation {
  id: string;
  consultationNumber: string;
  date: string;
  time: string;
  animalId: string;
  animal: Animal;
  ownerId: string;
  owner: Owner;
  veterinarianId: string;
  veterinarian: string;
  chiefComplaint: string;
  clinicalFindings: string;
  diagnosis: string;
  treatment: string;
  prescriptions: PrescriptionItem[];
  followUpDate?: string;
  followUpNotes?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  totalCost: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  notes: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  timestamps: {
    scheduled: string;
    started?: string;
    completed?: string;
  };
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number; // in minutes
  animalId: string;
  animal: Animal;
  ownerId: string;
  owner: Owner;
  veterinarianId: string;
  veterinarian: string;
  type: 'Consultation' | 'Follow-up' | 'Vaccination' | 'Surgery' | 'Emergency';
  reason: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationTemplate {
  id: string;
  name: string;
  species: string;
  category: string;
  chiefComplaint: string;
  clinicalFindings: string;
  diagnosis: string;
  treatment: string;
  commonPrescriptions: PrescriptionItem[];
  createdBy: string;
  isActive: boolean;
}