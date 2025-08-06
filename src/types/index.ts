export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Vet' | 'Auditor';
  avatar?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  code: string;
}

export interface GRNItem {
  id: string;
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  batchNumber: string;
  expirationDate: string;
  code: string;
  remarks: string;
  totalPrice: number;
}

export interface GRN {
  id: string;
  grnNumber: string;
  supplierName: string;
  invoiceNumber: string;
  prRequisitionNumber: string;
  date: string;
  items: GRNItem[];
  grandTotal: number;
  receivedBy: string;
  checkedBy: string;
  approvedBy: string;
  deliveredBy: string;
  status: 'Pending' | 'Checked' | 'Approved' | 'Received';
  remarks: string;
  createdAt: string;
  updatedAt: string;
  timestamps: {
    created: string;
    checked?: string;
    approved?: string;
    received?: string;
  };
}

export interface DeliveryItem {
  id: string;
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  code: string;
  remarks: string;
  totalPrice: number;
  availableStock: number;
}

export interface Recipient {
  id: string;
  name: string;
  type: 'Clinic' | 'Hospital' | 'Individual' | 'Pharmacy';
  contact: string;
  email: string;
  address: string;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  recipientName: string;
  recipientAddress: string;
  recipientContact: string;
  driverName: string;
  truckPlateNo: string;
  date: string;
  items: DeliveryItem[];
  grandTotal: number;
  approvedBy: string;
  receivedBy: string;
  approvedDate?: string;
  receivedDate?: string;
  status: 'Pending' | 'Approved' | 'In Transit' | 'Delivered' | 'Confirmed';
  remarks: string;
  createdAt: string;
  updatedAt: string;
  timestamps: {
    created: string;
    approved?: string;
    dispatched?: string;
    delivered?: string;
    confirmed?: string;
  };
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: any;
  roles: User['role'][];
  badge?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  code: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumLevel: number;
  maximumLevel: number;
  unitPrice: number;
  shelfNo?: string;
  category?: string;
  description?: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  date: string;
  type: 'received' | 'issued';
  referenceNumber: string;
  quantity: number;
  balanceAfter: number;
  remarks: string;
  createdBy: string;
}