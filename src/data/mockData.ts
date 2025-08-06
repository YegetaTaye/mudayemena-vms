import { User, Supplier, Product, GRN, GRNItem, DeliveryNote, DeliveryItem, Recipient, InventoryItem, StockMovement } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@vetpharm.com',
    role: 'Admin',
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'staff@vetpharm.com',
    role: 'Staff',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    email: 'vet@vetpharm.com',
    role: 'Vet',
    avatar: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'auditor@vetpharm.com',
    role: 'Auditor',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'VetMed Supplies Inc.',
    contact: '+1-555-0123',
    email: 'orders@vetmedsupplies.com',
    address: '123 Medical Drive, Healthcare City, HC 12345'
  },
  {
    id: '2',
    name: 'Animal Health Solutions',
    contact: '+1-555-0456',
    email: 'sales@animalhealthsolutions.com',
    address: '456 Veterinary Way, Pet Town, PT 67890'
  },
  {
    id: '3',
    name: 'PharmaPet Distribution',
    contact: '+1-555-0789',
    email: 'support@pharmapet.com',
    address: '789 Supply Chain Blvd, Distribution Hub, DH 11223'
  },
  {
    id: '4',
    name: 'MediVet Corp',
    contact: '+1-555-0321',
    email: 'info@medivet.com',
    address: '321 Pharmaceutical Ave, Med City, MC 44556'
  }
];

export const mockRecipients: Recipient[] = [
  {
    id: '1',
    name: 'City Animal Hospital',
    type: 'Hospital',
    contact: '+1-555-1001',
    email: 'orders@cityanimalhospital.com',
    address: '789 Main Street, Downtown, DT 12345'
  },
  {
    id: '2',
    name: 'Paws & Claws Veterinary Clinic',
    type: 'Clinic',
    contact: '+1-555-1002',
    email: 'supplies@pawsandclaws.com',
    address: '456 Oak Avenue, Suburbia, SB 67890'
  },
  {
    id: '3',
    name: 'Dr. Michael Rodriguez',
    type: 'Individual',
    contact: '+1-555-1003',
    email: 'mrodriguez@email.com',
    address: '123 Elm Street, Residential Area, RA 11223'
  },
  {
    id: '4',
    name: 'Pet Care Pharmacy',
    type: 'Pharmacy',
    contact: '+1-555-1004',
    email: 'manager@petcarepharmacy.com',
    address: '321 Commerce Blvd, Business District, BD 44556'
  },
  {
    id: '5',
    name: 'Emergency Vet Services',
    type: 'Hospital',
    contact: '+1-555-1005',
    email: 'emergency@emergencyvet.com',
    address: '555 Hospital Drive, Medical Center, MC 77889'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic for bacterial infections in dogs and cats',
    unit: 'Tablets',
    category: 'Antibiotics',
    code: 'AMX500'
  },
  {
    id: '2',
    name: 'Metacam 1.5mg/ml',
    description: 'Anti-inflammatory pain relief for dogs',
    unit: 'ml',
    category: 'Pain Relief',
    code: 'MTC15'
  },
  {
    id: '3',
    name: 'Frontline Plus',
    description: 'Flea and tick prevention for dogs and cats',
    unit: 'Pipettes',
    category: 'Parasiticides',
    code: 'FLP001'
  },
  {
    id: '4',
    name: 'Baytril 50mg',
    description: 'Broad-spectrum antibiotic for various infections',
    unit: 'Tablets',
    category: 'Antibiotics',
    code: 'BAY50'
  },
  {
    id: '5',
    name: 'Heartgard Plus',
    description: 'Heartworm prevention chewable tablets',
    unit: 'Chewables',
    category: 'Preventatives',
    code: 'HGP001'
  },
  {
    id: '6',
    name: 'Revolution Plus',
    description: 'Broad-spectrum parasite prevention',
    unit: 'Tubes',
    category: 'Parasiticides',
    code: 'REV001'
  },
  {
    id: '7',
    name: 'Cerenia 16mg',
    description: 'Anti-nausea medication for dogs',
    unit: 'Tablets',
    category: 'Gastrointestinal',
    code: 'CER16'
  },
  {
    id: '8',
    name: 'Adequan Canine',
    description: 'Injectable treatment for canine arthritis',
    unit: 'Vials',
    category: 'Joint Care',
    code: 'ADQ001'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Amoxicillin 500mg',
    code: 'AMX500',
    unit: 'Tablets',
    currentStock: 500,
    reservedStock: 50,
    availableStock: 450,
    minimumLevel: 100,
    maximumLevel: 1000,
    unitPrice: 2.50,
    shelfNo: 'A1-2',
    category: 'Antibiotics',
    description: 'Antibiotic for bacterial infections in dogs and cats',
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Metacam 1.5mg/ml',
    code: 'MTC15',
    unit: 'ml',
    currentStock: 200,
    reservedStock: 25,
    availableStock: 175,
    minimumLevel: 50,
    maximumLevel: 500,
    unitPrice: 15.75,
    shelfNo: 'B2-1',
    category: 'Pain Relief',
    description: 'Anti-inflammatory pain relief for dogs',
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '3',
    productId: '3',
    productName: 'Frontline Plus',
    code: 'FLP001',
    unit: 'Pipettes',
    currentStock: 150,
    reservedStock: 10,
    availableStock: 140,
    minimumLevel: 30,
    maximumLevel: 300,
    unitPrice: 12.99,
    shelfNo: 'C1-3',
    category: 'Parasiticides',
    description: 'Flea and tick prevention for dogs and cats',
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '4',
    productId: '4',
    productName: 'Baytril 50mg',
    code: 'BAY50',
    unit: 'Tablets',
    currentStock: 300,
    reservedStock: 30,
    availableStock: 270,
    minimumLevel: 75,
    maximumLevel: 600,
    unitPrice: 3.25,
    shelfNo: 'A2-1',
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic for various infections',
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '5',
    productId: '5',
    productName: 'Heartgard Plus',
    code: 'HGP001',
    unit: 'Chewables',
    currentStock: 85,
    reservedStock: 15,
    availableStock: 70,
    minimumLevel: 25,
    maximumLevel: 200,
    unitPrice: 8.50,
    shelfNo: 'D1-2',
    category: 'Preventatives',
    description: 'Heartworm prevention chewable tablets',
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '6',
    productId: '6',
    productName: 'Revolution Plus',
    code: 'REV001',
    unit: 'Tubes',
    currentStock: 45,
    reservedStock: 5,
    availableStock: 40,
    minimumLevel: 20,
    maximumLevel: 150,
    unitPrice: 18.99,
    shelfNo: 'C2-1',
    category: 'Parasiticides',
    description: 'Broad-spectrum parasite prevention',
    lastUpdated: '2024-01-19T14:15:00Z'
  },
  {
    id: '7',
    productId: '7',
    productName: 'Cerenia 16mg',
    code: 'CER16',
    unit: 'Tablets',
    currentStock: 15,
    reservedStock: 0,
    availableStock: 15,
    minimumLevel: 20,
    maximumLevel: 100,
    unitPrice: 4.75,
    shelfNo: 'B1-3',
    category: 'Gastrointestinal',
    description: 'Anti-nausea medication for dogs',
    lastUpdated: '2024-01-18T09:45:00Z'
  },
  {
    id: '8',
    productId: '8',
    productName: 'Adequan Canine',
    code: 'ADQ001',
    unit: 'Vials',
    currentStock: 120,
    reservedStock: 8,
    availableStock: 112,
    minimumLevel: 30,
    maximumLevel: 200,
    unitPrice: 25.50,
    shelfNo: 'E1-1',
    category: 'Joint Care',
    description: 'Injectable treatment for canine arthritis',
    lastUpdated: '2024-01-21T16:20:00Z'
  }
];

export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    date: '2024-01-20T10:30:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-001',
    quantity: 100,
    balanceAfter: 500,
    remarks: 'Received from VetMed Supplies Inc.',
    createdBy: 'Mike Chen'
  },
  {
    id: '2',
    itemId: '1',
    date: '2024-01-19T14:15:00Z',
    type: 'issued',
    referenceNumber: 'DN-2024-001',
    quantity: 50,
    balanceAfter: 400,
    remarks: 'Delivered to City Animal Hospital',
    createdBy: 'Mike Chen'
  },
  {
    id: '3',
    itemId: '1',
    date: '2024-01-18T09:45:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-002',
    quantity: 200,
    balanceAfter: 450,
    remarks: 'Emergency stock replenishment',
    createdBy: 'Dr. Sarah Johnson'
  },
  {
    id: '4',
    itemId: '2',
    date: '2024-01-20T10:30:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-001',
    quantity: 50,
    balanceAfter: 200,
    remarks: 'Received from VetMed Supplies Inc.',
    createdBy: 'Mike Chen'
  },
  {
    id: '5',
    itemId: '2',
    date: '2024-01-19T16:20:00Z',
    type: 'issued',
    referenceNumber: 'DN-2024-002',
    quantity: 20,
    balanceAfter: 150,
    remarks: 'Delivered to Paws & Claws Clinic',
    createdBy: 'Mike Chen'
  },
  {
    id: '6',
    itemId: '3',
    date: '2024-01-20T10:30:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-001',
    quantity: 25,
    balanceAfter: 150,
    remarks: 'Received from VetMed Supplies Inc.',
    createdBy: 'Mike Chen'
  },
  {
    id: '7',
    itemId: '4',
    date: '2024-01-19T11:30:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-002',
    quantity: 75,
    balanceAfter: 300,
    remarks: 'Received from Animal Health Solutions',
    createdBy: 'Mike Chen'
  },
  {
    id: '8',
    itemId: '5',
    date: '2024-01-20T14:20:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-003',
    quantity: 30,
    balanceAfter: 85,
    remarks: 'Received from PharmaPet Distribution',
    createdBy: 'Mike Chen'
  },
  {
    id: '9',
    itemId: '7',
    date: '2024-01-18T09:45:00Z',
    type: 'issued',
    referenceNumber: 'DN-2024-003',
    quantity: 10,
    balanceAfter: 15,
    remarks: 'Emergency delivery to Dr. Rodriguez',
    createdBy: 'Dr. Emily Watson'
  },
  {
    id: '10',
    itemId: '8',
    date: '2024-01-21T16:20:00Z',
    type: 'received',
    referenceNumber: 'GRN-2024-004',
    quantity: 50,
    balanceAfter: 120,
    remarks: 'Monthly stock replenishment',
    createdBy: 'Mike Chen'
  }
];

export const mockGRNItems: GRNItem[] = [
  {
    id: '1',
    itemId: '1',
    description: 'Amoxicillin 500mg - Antibiotic for bacterial infections',
    quantity: 100,
    unitPrice: 2.50,
    batchNumber: 'AMX001234',
    expirationDate: '2025-12-31',
    code: 'AMX500',
    remarks: 'Store in cool, dry place',
    totalPrice: 250.00
  },
  {
    id: '2',
    itemId: '2',
    description: 'Metacam 1.5mg/ml - Anti-inflammatory pain relief',
    quantity: 50,
    unitPrice: 15.75,
    batchNumber: 'MTC567890',
    expirationDate: '2025-08-15',
    code: 'MTC15',
    remarks: 'Refrigerate after opening',
    totalPrice: 787.50
  },
  {
    id: '3',
    itemId: '3',
    description: 'Frontline Plus - Flea and tick prevention',
    quantity: 25,
    unitPrice: 12.99,
    batchNumber: 'FLP345678',
    expirationDate: '2025-06-30',
    code: 'FLP001',
    remarks: 'Keep away from children',
    totalPrice: 324.75
  }
];

export const mockDeliveryItems: DeliveryItem[] = [
  {
    id: '1',
    itemId: '1',
    description: 'Amoxicillin 500mg - Antibiotic for bacterial infections',
    quantity: 50,
    unitPrice: 2.50,
    code: 'AMX500',
    remarks: 'Handle with care',
    totalPrice: 125.00,
    availableStock: 450
  },
  {
    id: '2',
    itemId: '2',
    description: 'Metacam 1.5mg/ml - Anti-inflammatory pain relief',
    quantity: 20,
    unitPrice: 15.75,
    code: 'MTC15',
    remarks: 'Keep refrigerated',
    totalPrice: 315.00,
    availableStock: 175
  }
];

export const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    deliveryNumber: 'DN-2024-001',
    recipientName: 'City Animal Hospital',
    recipientAddress: '789 Main Street, Downtown, DT 12345',
    recipientContact: '+1-555-1001',
    driverName: 'John Smith',
    truckPlateNo: 'ABC-1234',
    date: '2024-01-20',
    items: mockDeliveryItems,
    grandTotal: 440.00,
    approvedBy: 'Dr. Sarah Johnson',
    receivedBy: 'Dr. Michael Brown',
    approvedDate: '2024-01-20',
    receivedDate: '2024-01-20',
    status: 'Delivered',
    remarks: 'Urgent delivery for emergency cases',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    timestamps: {
      created: '2024-01-20T08:00:00Z',
      approved: '2024-01-20T09:15:00Z',
      dispatched: '2024-01-20T10:00:00Z',
      delivered: '2024-01-20T16:30:00Z'
    }
  },
  {
    id: '2',
    deliveryNumber: 'DN-2024-002',
    recipientName: 'Paws & Claws Veterinary Clinic',
    recipientAddress: '456 Oak Avenue, Suburbia, SB 67890',
    recipientContact: '+1-555-1002',
    driverName: 'Maria Garcia',
    truckPlateNo: 'XYZ-5678',
    date: '2024-01-21',
    items: [
      {
        id: '3',
        itemId: '3',
        description: 'Frontline Plus - Flea and tick prevention',
        quantity: 30,
        unitPrice: 12.99,
        code: 'FLP001',
        remarks: 'Monthly supply',
        totalPrice: 389.70,
        availableStock: 140
      }
    ],
    grandTotal: 389.70,
    approvedBy: 'Dr. Sarah Johnson',
    receivedBy: '',
    approvedDate: '2024-01-21',
    status: 'In Transit',
    remarks: 'Regular monthly delivery',
    createdAt: '2024-01-21T07:30:00Z',
    updatedAt: '2024-01-21T11:45:00Z',
    timestamps: {
      created: '2024-01-21T07:30:00Z',
      approved: '2024-01-21T09:00:00Z',
      dispatched: '2024-01-21T11:45:00Z'
    }
  },
  {
    id: '3',
    deliveryNumber: 'DN-2024-003',
    recipientName: 'Dr. Michael Rodriguez',
    recipientAddress: '123 Elm Street, Residential Area, RA 11223',
    recipientContact: '+1-555-1003',
    driverName: '',
    truckPlateNo: '',
    date: '2024-01-22',
    items: [
      {
        id: '4',
        itemId: '4',
        description: 'Baytril 50mg - Broad-spectrum antibiotic',
        quantity: 25,
        unitPrice: 3.25,
        code: 'BAY50',
        remarks: 'For clinic use',
        totalPrice: 81.25,
        availableStock: 270
      }
    ],
    grandTotal: 81.25,
    approvedBy: '',
    receivedBy: '',
    status: 'Pending',
    remarks: 'Awaiting approval',
    createdAt: '2024-01-22T10:15:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    timestamps: {
      created: '2024-01-22T10:15:00Z'
    }
  }
];

export const mockGRNs: GRN[] = [
  {
    id: '1',
    grnNumber: 'GRN-2024-001',
    supplierName: 'VetMed Supplies Inc.',
    invoiceNumber: 'INV-VM-2024-0156',
    prRequisitionNumber: 'PR-2024-0089',
    date: '2024-01-18',
    items: mockGRNItems,
    grandTotal: 1362.25,
    receivedBy: 'Mike Chen',
    checkedBy: 'Dr. Emily Watson',
    approvedBy: 'Dr. Sarah Johnson',
    deliveredBy: 'VetMed Delivery Service',
    status: 'Approved',
    remarks: 'All items received in good condition. Metacam requires refrigeration.',
    createdAt: '2024-01-18T10:30:00Z',
    updatedAt: '2024-01-18T14:45:00Z',
    timestamps: {
      created: '2024-01-18T10:30:00Z',
      checked: '2024-01-18T12:15:00Z',
      approved: '2024-01-18T14:45:00Z',
      received: '2024-01-18T16:20:00Z'
    }
  },
  {
    id: '2',
    grnNumber: 'GRN-2024-002',
    supplierName: 'Animal Health Solutions',
    invoiceNumber: 'INV-AHS-2024-0298',
    prRequisitionNumber: 'PR-2024-0090',
    date: '2024-01-19',
    items: [
      {
        id: '4',
        itemId: '4',
        description: 'Baytril 50mg - Broad-spectrum antibiotic',
        quantity: 75,
        unitPrice: 3.25,
        batchNumber: 'BAY789012',
        expirationDate: '2025-10-20',
        code: 'BAY50',
        remarks: 'Handle with care',
        totalPrice: 243.75
      }
    ],
    grandTotal: 243.75,
    receivedBy: 'Mike Chen',
    checkedBy: '',
    approvedBy: '',
    deliveredBy: 'AHS Express',
    status: 'Checked',
    remarks: 'Pending approval from administrator',
    createdAt: '2024-01-19T09:15:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    timestamps: {
      created: '2024-01-19T09:15:00Z',
      checked: '2024-01-19T11:30:00Z'
    }
  },
  {
    id: '3',
    grnNumber: 'GRN-2024-003',
    supplierName: 'PharmaPet Distribution',
    invoiceNumber: 'INV-PPD-2024-0445',
    prRequisitionNumber: 'PR-2024-0091',
    date: '2024-01-20',
    items: [
      {
        id: '5',
        itemId: '5',
        description: 'Heartgard Plus - Heartworm prevention',
        quantity: 30,
        unitPrice: 8.50,
        batchNumber: 'HGP456789',
        expirationDate: '2025-09-15',
        code: 'HGP001',
        remarks: 'Monthly treatment',
        totalPrice: 255.00
      }
    ],
    grandTotal: 255.00,
    receivedBy: 'Mike Chen',
    checkedBy: '',
    approvedBy: '',
    deliveredBy: '',
    status: 'Pending',
    remarks: 'Awaiting quality check',
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    timestamps: {
      created: '2024-01-20T14:20:00Z'
    }
  }
];