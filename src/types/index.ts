// Application Types for Noble Consulting Platform

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'customer' | 'staff' | 'admin';
export type Language = 'mn' | 'en';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  language: Language;
  
  // Customer-specific fields
  passportNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  
  // Staff-specific fields
  department?: string;
  assignedApplicationIds?: string[];
  
  // Settings
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ============================================
// APPLICATION TYPES
// ============================================

export type ApplicationStatus = 
  | 'pending'              // Шинэ бүртгэл
  | 'consultation'         // Зөвлөгөө авч байгаа
  | 'payment_pending'      // Төлбөр хүлээгдэж буй
  | 'paid'                 // Төлбөр төлөгдсөн
  | 'documents_pending'    // Баримт хүлээгдэж буй
  | 'documents_incomplete' // Дутуу баримт
  | 'documents_complete'   // Бүрэн баримт
  | 'processing'           // Боловсруулж буй
  | 'submitted'            // Илгээгдсэн
  | 'approved'             // Зөвшөөрөгдсөн
  | 'rejected'             // Татгалзсан
  | 'completed';           // Биелсэн

export interface StatusChange {
  id: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  changedByName: string;
  changedAt: Date;
  reason?: string;
}

export interface RequiredDocument {
  id: string;
  documentTypeId: string;
  name: string;
  nameEn: string;
  description?: string;
  isRequired: boolean;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  rejectionReason?: string;
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  qpayInvoiceId?: string;
  qpayPaymentId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'system';
  senderAvatar?: string;
  content: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  isRead: boolean;
  createdAt: Date;
}

export interface StaffNote {
  id: string;
  staffId: string;
  staffName: string;
  content: string;
  createdAt: Date;
}

export interface Application {
  id: string;
  applicationNumber: string; // NOB-2026-0001
  
  // References
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceNameEn: string;
  serviceCategory: ServiceCategory;
  
  // Staff assignment
  assignedStaffId?: string;
  assignedStaffName?: string;
  
  // Status
  status: ApplicationStatus;
  statusHistory: StatusChange[];
  progress: number; // 0-100
  
  // Documents
  requiredDocuments: RequiredDocument[];
  
  // Payment
  payment: {
    serviceFee: number;
    additionalFees: {
      name: string;
      amount: number;
    }[];
    totalAmount: number;
    paidAmount: number;
    status: 'pending' | 'partial' | 'paid' | 'refunded';
    transactions: PaymentTransaction[];
  };
  
  // Communication
  messages: Message[];
  notes: StaffNote[];
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  expectedCompletionDate?: Date;
  completedAt?: Date;
}

// ============================================
// SERVICE TYPES
// ============================================

export type ServiceCategory = 'education' | 'travel' | 'work' | 'visa';

export interface DocumentRequirement {
  documentTypeId: string;
  isRequired: boolean;
  notes?: string;
}

export interface ServiceStep {
  order: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface FAQ {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

export interface Service {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  
  category: ServiceCategory;
  country?: string;
  countryCode?: string;
  icon: string;
  coverImage?: string;
  
  baseFee: number;
  processingTime: string;
  processingTimeEn: string;
  
  requiredDocuments: DocumentRequirement[];
  steps: ServiceStep[];
  faq: FAQ[];
  
  isActive: boolean;
  displayOrder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// DOCUMENT TYPE
// ============================================

export interface DocumentType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  
  acceptedFormats: string[];
  maxSizeMB: number;
  
  category: string;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// NEWS TYPES
// ============================================

export type NewsCategory = 'announcement' | 'education' | 'travel' | 'work' | 'visa' | 'tips';

export interface News {
  id: string;
  
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  excerpt: string;
  excerptEn: string;
  
  coverImage?: string;
  images: string[];
  
  category: NewsCategory;
  tags: string[];
  
  author: {
    id: string;
    name: string;
  };
  
  isPublished: boolean;
  isPinned: boolean;
  publishedAt?: Date;
  
  views: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface APISettings {
  openai: {
    apiKey: string;
    model: string;
    assistantId?: string;
  };
  qpay: {
    invoiceCode: string;
    username: string;
    password: string;
    callbackUrl: string;
    isSandbox: boolean;
  };
}

export interface FeeSettings {
  services: Record<string, number>;
  expressProcessing: number;
  documentTranslation: number;
  consultation: number;
}

export interface CompanySettings {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  email: string;
  phone: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface NotificationTemplates {
  welcomeEmail: { mn: string; en: string };
  statusChangeEmail: { mn: string; en: string };
  paymentConfirmation: { mn: string; en: string };
  documentApproved: { mn: string; en: string };
  documentRejected: { mn: string; en: string };
}

export interface SystemSettings {
  api: APISettings;
  fees: FeeSettings;
  company: CompanySettings;
  notifications: NotificationTemplates;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// UTILITY TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
