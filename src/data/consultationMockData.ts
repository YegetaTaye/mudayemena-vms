import { Animal, Owner, Consultation, Appointment, PrescriptionItem, ConsultationTemplate } from '../types/consultation';

export const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 5,
    weight: 30,
    gender: 'Male',
    microchipId: 'MC001234567',
    notes: 'Friendly, good with children'
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    weight: 4.5,
    gender: 'Female',
    microchipId: 'MC001234568',
    notes: 'Indoor cat, shy with strangers'
  },
  {
    id: '3',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 7,
    weight: 35,
    gender: 'Male',
    microchipId: 'MC001234569',
    notes: 'Working dog, very active'
  },
  {
    id: '4',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    weight: 3.8,
    gender: 'Female',
    notes: 'Very vocal, loves attention'
  },
  {
    id: '5',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 4,
    weight: 28,
    gender: 'Male',
    microchipId: 'MC001234570',
    notes: 'Energetic, loves swimming'
  }
];

export const mockOwners: Owner[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    address: '123 Main Street, Anytown, AT 12345',
    emergencyContact: '+1-555-0102'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0201',
    address: '456 Oak Avenue, Somewhere, SW 67890',
    emergencyContact: '+1-555-0202'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0301',
    address: '789 Pine Road, Elsewhere, EW 11223',
    emergencyContact: '+1-555-0302'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0401',
    address: '321 Elm Street, Nowhere, NW 44556',
    emergencyContact: '+1-555-0402'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0501',
    address: '654 Maple Drive, Anywhere, AW 77889',
    emergencyContact: '+1-555-0502'
  }
];

export const mockPrescriptions: PrescriptionItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Amoxicillin 500mg',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '7 days',
    quantity: 14,
    instructions: 'Give with food to reduce stomach upset',
    unitPrice: 2.50,
    totalPrice: 35.00
  },
  {
    id: '2',
    productId: '2',
    productName: 'Metacam 1.5mg/ml',
    dosage: '0.1mg/kg',
    frequency: 'Once daily',
    duration: '5 days',
    quantity: 5,
    instructions: 'Give with food, monitor for side effects',
    unitPrice: 15.75,
    totalPrice: 78.75
  }
];

export const mockConsultations: Consultation[] = [
  {
    id: '1',
    consultationNumber: 'CON-2024-001',
    date: '2024-01-21',
    time: '09:00',
    animalId: '1',
    animal: mockAnimals[0],
    ownerId: '1',
    owner: mockOwners[0],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    chiefComplaint: 'Limping on right front leg for 2 days',
    clinicalFindings: 'Mild swelling in right carpus, pain on palpation, no obvious fracture',
    diagnosis: 'Soft tissue injury - probable sprain',
    treatment: 'Rest, anti-inflammatory medication, follow-up in 1 week',
    prescriptions: [mockPrescriptions[1]],
    followUpDate: '2024-01-28',
    followUpNotes: 'Check mobility improvement',
    status: 'Completed',
    totalCost: 125.75,
    paymentStatus: 'Paid',
    notes: 'Owner advised to limit exercise for 1 week',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-21T09:45:00Z',
    timestamps: {
      scheduled: '2024-01-20T14:30:00Z',
      started: '2024-01-21T09:00:00Z',
      completed: '2024-01-21T09:45:00Z'
    }
  },
  {
    id: '2',
    consultationNumber: 'CON-2024-002',
    date: '2024-01-21',
    time: '10:30',
    animalId: '2',
    animal: mockAnimals[1],
    ownerId: '2',
    owner: mockOwners[1],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    chiefComplaint: 'Not eating for 24 hours, lethargic',
    clinicalFindings: 'Mild dehydration, elevated temperature (39.5°C), dental tartar buildup',
    diagnosis: 'Upper respiratory infection with dental disease',
    treatment: 'Antibiotics, dental cleaning recommended',
    prescriptions: [mockPrescriptions[0]],
    followUpDate: '2024-01-25',
    followUpNotes: 'Monitor appetite and energy levels',
    status: 'Completed',
    totalCost: 89.50,
    paymentStatus: 'Paid',
    notes: 'Schedule dental cleaning in 2 weeks',
    createdAt: '2024-01-21T10:30:00Z',
    updatedAt: '2024-01-21T11:15:00Z',
    timestamps: {
      scheduled: '2024-01-20T16:00:00Z',
      started: '2024-01-21T10:30:00Z',
      completed: '2024-01-21T11:15:00Z'
    }
  },
  {
    id: '3',
    consultationNumber: 'CON-2024-003',
    date: '2024-01-22',
    time: '14:00',
    animalId: '3',
    animal: mockAnimals[2],
    ownerId: '3',
    owner: mockOwners[2],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    chiefComplaint: 'Annual vaccination and health check',
    clinicalFindings: 'Good body condition, heart rate normal, no abnormalities detected',
    diagnosis: 'Healthy - routine vaccination',
    treatment: 'Annual vaccinations administered',
    prescriptions: [],
    status: 'Scheduled',
    totalCost: 75.00,
    paymentStatus: 'Pending',
    notes: 'Next vaccination due January 2025',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    timestamps: {
      scheduled: '2024-01-20T11:00:00Z'
    }
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-01-22',
    time: '09:00',
    duration: 30,
    animalId: '4',
    animal: mockAnimals[3],
    ownerId: '4',
    owner: mockOwners[3],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    type: 'Consultation',
    reason: 'Excessive scratching and hair loss',
    status: 'Scheduled',
    notes: 'Possible skin allergy',
    reminderSent: false,
    createdAt: '2024-01-20T15:30:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    date: '2024-01-22',
    time: '10:00',
    duration: 45,
    animalId: '5',
    animal: mockAnimals[4],
    ownerId: '5',
    owner: mockOwners[4],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    type: 'Follow-up',
    reason: 'Post-surgery check-up',
    status: 'Confirmed',
    notes: 'Remove stitches if healing well',
    reminderSent: true,
    createdAt: '2024-01-19T10:15:00Z',
    updatedAt: '2024-01-21T14:20:00Z'
  },
  {
    id: '3',
    date: '2024-01-22',
    time: '14:00',
    duration: 30,
    animalId: '3',
    animal: mockAnimals[2],
    ownerId: '3',
    owner: mockOwners[2],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    type: 'Vaccination',
    reason: 'Annual vaccination and health check',
    status: 'Scheduled',
    notes: 'Bring vaccination record',
    reminderSent: false,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z'
  },
  {
    id: '4',
    date: '2024-01-23',
    time: '11:30',
    duration: 60,
    animalId: '1',
    animal: mockAnimals[0],
    ownerId: '1',
    owner: mockOwners[0],
    veterinarianId: '3',
    veterinarian: 'Dr. Emily Watson',
    type: 'Surgery',
    reason: 'Dental cleaning under anesthesia',
    status: 'Scheduled',
    notes: 'Fast for 12 hours before procedure',
    reminderSent: false,
    createdAt: '2024-01-21T16:45:00Z',
    updatedAt: '2024-01-21T16:45:00Z'
  }
];

export const mockConsultationTemplates: ConsultationTemplate[] = [
  {
    id: '1',
    name: 'Routine Vaccination - Dog',
    species: 'Dog',
    category: 'Preventive Care',
    chiefComplaint: 'Annual vaccination and health check',
    clinicalFindings: 'Physical examination findings to be documented',
    diagnosis: 'Healthy - routine vaccination',
    treatment: 'Annual vaccinations administered as per schedule',
    commonPrescriptions: [],
    createdBy: 'Dr. Emily Watson',
    isActive: true
  },
  {
    id: '2',
    name: 'Upper Respiratory Infection - Cat',
    species: 'Cat',
    category: 'Infectious Disease',
    chiefComplaint: 'Sneezing, nasal discharge, reduced appetite',
    clinicalFindings: 'Nasal discharge, elevated temperature, mild dehydration',
    diagnosis: 'Upper respiratory tract infection',
    treatment: 'Supportive care, antibiotics if bacterial component suspected',
    commonPrescriptions: [
      {
        id: 'template-1',
        productId: '1',
        productName: 'Amoxicillin 500mg',
        dosage: '250mg',
        frequency: 'Twice daily',
        duration: '7 days',
        quantity: 14,
        instructions: 'Give with food',
        unitPrice: 2.50,
        totalPrice: 35.00
      }
    ],
    createdBy: 'Dr. Emily Watson',
    isActive: true
  },
  {
    id: '3',
    name: 'Soft Tissue Injury - Dog',
    species: 'Dog',
    category: 'Orthopedic',
    chiefComplaint: 'Limping, reluctance to bear weight',
    clinicalFindings: 'Pain on palpation, swelling, reduced range of motion',
    diagnosis: 'Soft tissue injury/sprain',
    treatment: 'Rest, anti-inflammatory medication, physiotherapy',
    commonPrescriptions: [
      {
        id: 'template-2',
        productId: '2',
        productName: 'Metacam 1.5mg/ml',
        dosage: '0.1mg/kg',
        frequency: 'Once daily',
        duration: '5 days',
        quantity: 5,
        instructions: 'Give with food, monitor for side effects',
        unitPrice: 15.75,
        totalPrice: 78.75
      }
    ],
    createdBy: 'Dr. Emily Watson',
    isActive: true
  }
];