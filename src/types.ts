export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  avatarUrl?: string;
}

export interface DoctorScheduleDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  enabled: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  breakStart?: string; // "13:00"
  breakEnd?: string;   // "14:00"
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  title: string; // "MD, FACC"
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  clinicAddress: string;
  hospitalAffiliation: string;
  bio: string;
  education: string[];
  languages: string[];
  consultationModes: ('in_person' | 'video')[];
  slotDurationMinutes: number; // 30
  schedule: DoctorScheduleDay[];
  isVerified: boolean;
  avatarUrl: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'in_person' | 'video';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM"
  type: ConsultationType;
  status: AppointmentStatus;
  fee: number;
  reason: string;
  notes?: string;
  cancellationReason?: string;
  meetingLink?: string;
  createdAt: string;
}

export interface PrescriptionMedication {
  id: string;
  name: string;
  dosage: string;      // e.g. "10mg"
  frequency: string;   // e.g. "Once daily", "Twice daily after meals"
  duration: string;    // e.g. "14 days", "30 days"
  timing: string;      // "Before Food" | "After Food" | "Bedtime"
  instructions: string; // "Drink plenty of water"
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorCredentials: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  clinicalNotes?: string;
  medications: PrescriptionMedication[];
  followUpDate?: string;
  isDemoRecord: boolean;
  signedAt: string;
}

export type RecordCategory = 
  | 'lab_report' 
  | 'imaging_scan' 
  | 'prescription' 
  | 'discharge_summary' 
  | 'vaccination' 
  | 'clinical_notes';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: RecordCategory;
  date: string;
  facility: string;
  doctorName?: string;
  summary: string;
  fileType: 'PDF' | 'DICOM' | 'JPG';
  fileSize: string;
  isDemo: boolean;
  tags: string[];
  uploadedAt: string;
}

export interface LabReportTestItem {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal';
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testCategory: string;
  laboratoryName: string;
  sampleCollectedDate: string;
  reportDate: string;
  referringDoctor: string;
  status: 'Completed' | 'Pending Review';
  overallInterpretation: string;
  results: LabReportTestItem[];
  isDemo: boolean;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'report' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  receiptNumber: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}
