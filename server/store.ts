import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import type {
  User,
  PatientProfile,
  DoctorProfile,
  Appointment,
  Prescription,
  MedicalRecord,
  LabReport,
  MessageItem,
  NotificationItem,
  Invoice,
  AuditLogItem,
} from '../src/types.ts';

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'mediconnect-data')
  : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mediconnect_db.json');

// Real generated image paths from our image generator
export const DOCTOR_IMAGES = {
  SARAH_CHEN: '/src/assets/images/doctor_sarah_chen_1793264706983.jpg',
  MARCUS_VANCE: '/src/assets/images/doctor_marcus_vance_1793264707626.jpg',
  ELENA_RODRIGUEZ: '/src/assets/images/doctor_elena_rodriguez_1793264708703.jpg',
  HERO_CONSULTATION: '/src/assets/images/hero_medical_consultation_1793264706670.jpg',
  DIGITAL_RECORDS: '/src/assets/images/digital_health_records_1793264708517.jpg',
};

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  patientProfiles: PatientProfile[];
  doctorProfiles: DoctorProfile[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  records: MedicalRecord[];
  labReports: LabReport[];
  messages: MessageItem[];
  notifications: NotificationItem[];
  invoices: Invoice[];
  auditLogs: AuditLogItem[];
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_salt_medi_2026').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function getInitialSeedData(): DatabaseSchema {
  const patientUser: User & { passwordHash: string } = {
    id: 'user_pat_01',
    name: 'Alex Morgan',
    email: 'patient@mediconnect.demo',
    role: 'patient',
    phone: '+1 (555) 234-8901',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    passwordHash: hashPassword('patient123'),
  };

  const doctorUser1: User & { passwordHash: string } = {
    id: 'user_doc_01',
    name: 'Dr. Sarah Chen',
    email: 'doctor@mediconnect.demo',
    role: 'doctor',
    phone: '+1 (555) 432-1100',
    avatarUrl: DOCTOR_IMAGES.SARAH_CHEN,
    createdAt: '2025-11-01T09:00:00Z',
    passwordHash: hashPassword('doctor123'),
  };

  const doctorUser2: User & { passwordHash: string } = {
    id: 'user_doc_02',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@mediconnect.demo',
    role: 'doctor',
    phone: '+1 (555) 432-2200',
    avatarUrl: DOCTOR_IMAGES.MARCUS_VANCE,
    createdAt: '2025-11-05T09:00:00Z',
    passwordHash: hashPassword('doctor123'),
  };

  const doctorUser3: User & { passwordHash: string } = {
    id: 'user_doc_03',
    name: 'Dr. Elena Rodriguez',
    email: 'elena.rodriguez@mediconnect.demo',
    role: 'doctor',
    phone: '+1 (555) 432-3300',
    avatarUrl: DOCTOR_IMAGES.ELENA_RODRIGUEZ,
    createdAt: '2025-12-01T09:00:00Z',
    passwordHash: hashPassword('doctor123'),
  };

  const adminUser: User & { passwordHash: string } = {
    id: 'user_adm_01',
    name: 'Chief Clinical Admin',
    email: 'admin@mediconnect.demo',
    role: 'admin',
    phone: '+1 (555) 999-0011',
    avatarUrl: '',
    createdAt: '2025-01-01T00:00:00Z',
    passwordHash: hashPassword('admin123'),
  };

  const patientProfile: PatientProfile = {
    id: 'pat_prof_01',
    userId: patientUser.id,
    fullName: 'Alex Morgan',
    email: 'patient@mediconnect.demo',
    phone: '+1 (555) 234-8901',
    dob: '1992-06-14',
    gender: 'Male',
    bloodGroup: 'O+ Positive',
    allergies: ['Penicillin (Moderate rash)', 'Shellfish'],
    chronicConditions: ['Stage 1 Essential Hypertension (Controlled)'],
    currentMedications: ['Lisinopril 10mg PO Daily', 'Omega-3 Fish Oil 1000mg'],
    emergencyContact: {
      name: 'Claire Morgan',
      relationship: 'Spouse',
      phone: '+1 (555) 234-8902',
    },
    address: '742 Evergreen Terrace, Metro Health District, CA 94107',
    insuranceProvider: 'BlueCross BlueShield Premier Health',
    insurancePolicyNumber: 'BCBS-98847291-A',
  };

  const doctorProfile1: DoctorProfile = {
    id: 'doc_prof_01',
    userId: doctorUser1.id,
    fullName: 'Dr. Sarah Chen, MD',
    title: 'MD, FACC · Senior Interventional Cardiologist',
    specialty: 'Cardiology',
    subSpecialty: 'Preventive & Interventional Cardiology',
    experienceYears: 14,
    consultationFee: 120,
    rating: 4.9,
    reviewCount: 184,
    clinicAddress: 'St. Luke Heart Center, Suite 402, Metro Health Plaza',
    hospitalAffiliation: 'Metropolitan University Hospital',
    bio: 'Board-certified cardiologist specializing in preventive cardiovascular care, hypertension management, and echocardiographic diagnostics. Dedicated to patient-centric lifestyle and evidence-based clinical treatment.',
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Cardiology Fellowship, Stanford Medical Center',
      'Board Certified in Internal Medicine and Cardiovascular Disease'
    ],
    languages: ['English', 'Mandarin'],
    consultationModes: ['in_person', 'video'],
    slotDurationMinutes: 30,
    schedule: [
      { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Friday', enabled: true, startTime: '09:00', endTime: '16:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Saturday', enabled: false, startTime: '10:00', endTime: '14:00' },
      { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '14:00' },
    ],
    isVerified: true,
    avatarUrl: DOCTOR_IMAGES.SARAH_CHEN,
  };

  const doctorProfile2: DoctorProfile = {
    id: 'doc_prof_02',
    userId: doctorUser2.id,
    fullName: 'Dr. Marcus Vance, MD',
    title: 'MD, FAAN · Neurologist & Neurophysiology Specialist',
    specialty: 'Neurology',
    subSpecialty: 'Headache & Cerebrovascular Disorders',
    experienceYears: 16,
    consultationFee: 150,
    rating: 4.9,
    reviewCount: 212,
    clinicAddress: 'NeuroVance Clinic, 12th Floor, Tower B, West Medical Wing',
    hospitalAffiliation: 'St. Jude Neurological Institute',
    bio: 'Pioneering neurologist with over 16 years of clinical excellence in migraine therapy, neuro-imaging evaluation, and cognitive health optimization.',
    education: [
      'MD, Harvard Medical School',
      'Residency in Neurology, Mass General Hospital',
      'Fellowship in Clinical Neurophysiology, UCSF'
    ],
    languages: ['English', 'Spanish'],
    consultationModes: ['in_person', 'video'],
    slotDurationMinutes: 30,
    schedule: [
      { day: 'Monday', enabled: true, startTime: '10:00', endTime: '18:00', breakStart: '13:30', breakEnd: '14:30' },
      { day: 'Tuesday', enabled: true, startTime: '10:00', endTime: '18:00', breakStart: '13:30', breakEnd: '14:30' },
      { day: 'Wednesday', enabled: true, startTime: '10:00', endTime: '18:00', breakStart: '13:30', breakEnd: '14:30' },
      { day: 'Thursday', enabled: true, startTime: '10:00', endTime: '18:00', breakStart: '13:30', breakEnd: '14:30' },
      { day: 'Friday', enabled: true, startTime: '10:00', endTime: '16:00', breakStart: '13:00', breakEnd: '14:00' },
      { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '13:00' },
      { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '14:00' },
    ],
    isVerified: true,
    avatarUrl: DOCTOR_IMAGES.MARCUS_VANCE,
  };

  const doctorProfile3: DoctorProfile = {
    id: 'doc_prof_03',
    userId: doctorUser3.id,
    fullName: 'Dr. Elena Rodriguez, MD',
    title: 'MD, FAAP · Pediatric & Adolescent Health Specialist',
    specialty: 'Pediatrics',
    subSpecialty: 'Child Wellness & Preventive Immunology',
    experienceYears: 10,
    consultationFee: 95,
    rating: 4.8,
    reviewCount: 148,
    clinicAddress: 'BrightCare Children Center, 350 Sunrise Blvd',
    hospitalAffiliation: 'Valley Children Hospital',
    bio: 'Compassionate pediatric specialist focused on child growth tracking, developmental milestones, vaccination schedules, and adolescent health care.',
    education: [
      'MD, Baylor College of Medicine',
      'Pediatric Residency, Children Hospital of Philadelphia'
    ],
    languages: ['English', 'Spanish'],
    consultationModes: ['in_person', 'video'],
    slotDurationMinutes: 30,
    schedule: [
      { day: 'Monday', enabled: true, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30' },
      { day: 'Tuesday', enabled: true, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30' },
      { day: 'Wednesday', enabled: true, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30' },
      { day: 'Thursday', enabled: true, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30' },
      { day: 'Friday', enabled: true, startTime: '08:30', endTime: '15:00', breakStart: '12:30', breakEnd: '13:30' },
      { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '12:00' },
      { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '12:00' },
    ],
    isVerified: true,
    avatarUrl: DOCTOR_IMAGES.ELENA_RODRIGUEZ,
  };

  const appointments: Appointment[] = [
    {
      id: 'apt_1001',
      patientId: patientUser.id,
      patientName: patientUser.name,
      patientPhone: patientProfile.phone,
      doctorId: doctorUser1.id,
      doctorName: doctorProfile1.fullName,
      doctorSpecialty: doctorProfile1.specialty,
      doctorAvatar: doctorProfile1.avatarUrl,
      date: '2026-10-31',
      timeSlot: '10:00 AM',
      type: 'video',
      status: 'confirmed',
      fee: 120,
      reason: 'Routine quarterly cardiovascular review & blood pressure titration',
      meetingLink: 'https://meet.mediconnect.internal/room-apt-1001',
      createdAt: '2026-10-25T11:20:00Z',
    },
    {
      id: 'apt_1002',
      patientId: patientUser.id,
      patientName: patientUser.name,
      patientPhone: patientProfile.phone,
      doctorId: doctorUser2.id,
      doctorName: doctorProfile2.fullName,
      doctorSpecialty: doctorProfile2.specialty,
      doctorAvatar: doctorProfile2.avatarUrl,
      date: '2026-11-04',
      timeSlot: '02:30 PM',
      type: 'in_person',
      status: 'confirmed',
      fee: 150,
      reason: 'Periodic migraine symptom evaluation & follow-up',
      createdAt: '2026-10-26T14:45:00Z',
    },
    {
      id: 'apt_0998',
      patientId: patientUser.id,
      patientName: patientUser.name,
      patientPhone: patientProfile.phone,
      doctorId: doctorUser1.id,
      doctorName: doctorProfile1.fullName,
      doctorSpecialty: doctorProfile1.specialty,
      doctorAvatar: doctorProfile1.avatarUrl,
      date: '2026-09-15',
      timeSlot: '11:00 AM',
      type: 'in_person',
      status: 'completed',
      fee: 120,
      reason: 'Mild hypertension workup and ECG review',
      notes: 'Patient responded well to Lisinopril 10mg. Blood pressure measured 124/82 mmHg. Advised continued aerobic exercise 30 min daily.',
      createdAt: '2026-09-08T09:12:00Z',
    },
    {
      id: 'apt_0990',
      patientId: patientUser.id,
      patientName: patientUser.name,
      patientPhone: patientProfile.phone,
      doctorId: doctorUser3.id,
      doctorName: doctorProfile3.fullName,
      doctorSpecialty: doctorProfile3.specialty,
      doctorAvatar: doctorProfile3.avatarUrl,
      date: '2026-08-20',
      timeSlot: '09:30 AM',
      type: 'video',
      status: 'cancelled',
      cancellationReason: 'Patient rescheduled due to work travel conflict',
      fee: 95,
      reason: 'General wellness check',
      createdAt: '2026-08-15T16:00:00Z',
    },
  ];

  const prescriptions: Prescription[] = [
    {
      id: 'rx_8001',
      appointmentId: 'apt_0998',
      patientId: patientUser.id,
      patientName: 'Alex Morgan',
      patientAge: 32,
      patientGender: 'Male',
      doctorId: doctorUser1.id,
      doctorName: 'Dr. Sarah Chen, MD',
      doctorSpecialty: 'Cardiology',
      doctorCredentials: 'MD, FACC · Lic #CAR-92044',
      clinicName: 'St. Luke Heart Center, Metro Plaza',
      date: '2026-09-15',
      diagnosis: 'Essential Hypertension (I10) · Controlled',
      clinicalNotes: 'Blood pressure remains well-tolerated. Normal serum potassium. Continue low-sodium diet (<2,300mg/day) and follow-up in 6-8 weeks.',
      medications: [
        {
          id: 'med_01',
          name: 'Lisinopril Oral Tablet',
          dosage: '10 mg',
          frequency: 'Once daily in morning',
          duration: '60 days',
          timing: 'After Breakfast',
          instructions: 'Take consistently at same time each morning. Monitor sitting BP weekly.',
        },
        {
          id: 'med_02',
          name: 'Coenzyme Q-10 (Cardio Supplement)',
          dosage: '100 mg',
          frequency: 'Once daily',
          duration: '60 days',
          timing: 'With Meal',
          instructions: 'Take with food for optimal absorption.',
        },
      ],
      followUpDate: '2026-10-31',
      isDemoRecord: true,
      signedAt: '2026-09-15T11:42:00Z',
    },
  ];

  const records: MedicalRecord[] = [
    {
      id: 'rec_3001',
      patientId: patientUser.id,
      title: 'Digital Chest X-Ray (PA & Lateral Views)',
      category: 'imaging_scan',
      date: '2026-09-12',
      facility: 'Metro Diagnostics & Imaging Center',
      doctorName: 'Dr. Sarah Chen, MD',
      summary: 'Cardiothoracic ratio within normal limits (<0.50). Clear bilateral lung fields without focal consolidation, pleural effusion, or pneumothorax.',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      isDemo: true,
      tags: ['Chest X-Ray', 'Cardiovascular', 'Normal'],
      uploadedAt: '2026-09-12T14:30:00Z',
    },
    {
      id: 'rec_3002',
      patientId: patientUser.id,
      title: 'Comprehensive Lipid & Metabolic Panel',
      category: 'lab_report',
      date: '2026-09-10',
      facility: 'Quest Health Clinical Diagnostics',
      doctorName: 'Dr. Sarah Chen, MD',
      summary: 'Total Cholesterol: 188 mg/dL, HDL: 52 mg/dL, LDL: 110 mg/dL, Triglycerides: 130 mg/dL, Fasting Glucose: 92 mg/dL. All within target reference intervals.',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      isDemo: true,
      tags: ['Lipids', 'Metabolic', 'Fasting'],
      uploadedAt: '2026-09-10T16:15:00Z',
    },
    {
      id: 'rec_3003',
      patientId: patientUser.id,
      title: 'Ambulatory Discharge Summary - Arthroscopy',
      category: 'discharge_summary',
      date: '2025-05-18',
      facility: 'Metropolitan Surgical Pavilion',
      doctorName: 'Dr. Jonathan Hayes, Orthopedics',
      summary: 'Right knee diagnostic arthroscopy and minor partial meniscectomy. Uneventful recovery. Weight bearing as tolerated with knee brace for 10 days.',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      isDemo: true,
      tags: ['Discharge', 'Knee', 'Post-Op'],
      uploadedAt: '2025-05-19T09:00:00Z',
    },
    {
      id: 'rec_3004',
      patientId: patientUser.id,
      title: 'Adult Immunization Record & COVID-19 Booster',
      category: 'vaccination',
      date: '2025-11-20',
      facility: 'City Health Immunization Clinic',
      doctorName: 'Clinical Immunologist',
      summary: 'Tdap booster administered (Lot #TD-99214). Seasonal Influenza vaccine 2025-2026. Next tetanus booster due 2035.',
      fileType: 'PDF',
      fileSize: '840 KB',
      isDemo: true,
      tags: ['Vaccines', 'Immunology', 'Current'],
      uploadedAt: '2025-11-20T11:20:00Z',
    },
  ];

  const labReports: LabReport[] = [
    {
      id: 'lab_4001',
      patientId: patientUser.id,
      patientName: 'Alex Morgan',
      testName: 'Advanced Lipid Profile & Atherogenic Particles',
      testCategory: 'Cardiovascular Risk Stratification',
      laboratoryName: 'Metropolitan Diagnostic Core Laboratories',
      sampleCollectedDate: '2026-09-10',
      reportDate: '2026-09-11',
      referringDoctor: 'Dr. Sarah Chen, MD',
      status: 'Completed',
      overallInterpretation: 'Desirable cardiovascular lipid profile with optimal HDL/cholesterol ratio. No acute intervention required.',
      isDemo: true,
      results: [
        { name: 'Total Cholesterol', value: '188', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
        { name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', referenceRange: '> 40', status: 'normal' },
        { name: 'LDL Cholesterol (Calculated)', value: '110', unit: 'mg/dL', referenceRange: '< 130', status: 'normal' },
        { name: 'Triglycerides', value: '130', unit: 'mg/dL', referenceRange: '< 150', status: 'normal' },
        { name: 'Non-HDL Cholesterol', value: '136', unit: 'mg/dL', referenceRange: '< 160', status: 'normal' },
        { name: 'Total/HDL Ratio', value: '3.6', unit: 'ratio', referenceRange: '< 5.0', status: 'normal' },
      ],
    },
    {
      id: 'lab_4002',
      patientId: patientUser.id,
      patientName: 'Alex Morgan',
      testName: 'Glycated Hemoglobin (HbA1c) & Renal Function',
      testCategory: 'Endocrine & Metabolic Health',
      laboratoryName: 'Metropolitan Diagnostic Core Laboratories',
      sampleCollectedDate: '2026-09-10',
      reportDate: '2026-09-11',
      referringDoctor: 'Dr. Sarah Chen, MD',
      status: 'Completed',
      overallInterpretation: 'Euglycemic profile. Serum creatinine and eGFR indicate well-preserved renal filtration capacity.',
      isDemo: true,
      results: [
        { name: 'Hemoglobin A1c', value: '5.4', unit: '%', referenceRange: '4.0 - 5.6', status: 'normal' },
        { name: 'Estimated Average Glucose', value: '108', unit: 'mg/dL', referenceRange: '70 - 120', status: 'normal' },
        { name: 'Serum Creatinine', value: '0.92', unit: 'mg/dL', referenceRange: '0.70 - 1.30', status: 'normal' },
        { name: 'eGFR (CKD-EPI)', value: '104', unit: 'mL/min/1.73m²', referenceRange: '> 90', status: 'normal' },
        { name: 'Blood Urea Nitrogen (BUN)', value: '14', unit: 'mg/dL', referenceRange: '7 - 20', status: 'normal' },
      ],
    },
  ];

  const messages: MessageItem[] = [
    {
      id: 'msg_5001',
      conversationId: `conv_${patientUser.id}_${doctorUser1.id}`,
      senderId: patientUser.id,
      senderName: patientUser.name,
      senderRole: 'patient',
      recipientId: doctorUser1.id,
      content: 'Good morning Dr. Chen, should I continue taking Lisinopril on the morning of our upcoming video check-in on Friday?',
      timestamp: '2026-10-27T08:30:00Z',
      read: true,
    },
    {
      id: 'msg_5002',
      conversationId: `conv_${patientUser.id}_${doctorUser1.id}`,
      senderId: doctorUser1.id,
      senderName: doctorProfile1.fullName,
      senderRole: 'doctor',
      recipientId: patientUser.id,
      content: 'Hello Alex, yes, please take your regular morning dose with water as usual. Have your home blood pressure cuff handy during our call!',
      timestamp: '2026-10-27T09:15:00Z',
      read: true,
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_6001',
      userId: patientUser.id,
      title: 'Upcoming Video Consultation',
      message: 'Your video appointment with Dr. Sarah Chen is scheduled for Oct 31 at 10:00 AM.',
      type: 'appointment',
      read: false,
      link: '/patient/consultations',
      createdAt: '2026-10-28T09:00:00Z',
    },
    {
      id: 'notif_6002',
      userId: patientUser.id,
      title: 'Official E-Prescription Issued',
      message: 'Dr. Sarah Chen renewed your prescription for Lisinopril 10mg.',
      type: 'prescription',
      read: false,
      link: '/patient/prescriptions',
      createdAt: '2026-09-15T11:45:00Z',
    },
    {
      id: 'notif_6003',
      userId: doctorUser1.id,
      title: 'New Consultation Confirmed',
      message: 'Alex Morgan confirmed a virtual follow-up appointment for Oct 31, 10:00 AM.',
      type: 'appointment',
      read: false,
      link: '/doctor/appointments',
      createdAt: '2026-10-25T11:21:00Z',
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv_7001',
      patientId: patientUser.id,
      patientName: patientUser.name,
      doctorId: doctorUser1.id,
      doctorName: doctorProfile1.fullName,
      appointmentId: 'apt_1001',
      amount: 120,
      date: '2026-10-25',
      status: 'paid',
      paymentMethod: 'Mastercard ending in 4921 (Simulated)',
      receiptNumber: 'REC-2026-89410',
    },
    {
      id: 'inv_7002',
      patientId: patientUser.id,
      patientName: patientUser.name,
      doctorId: doctorUser2.id,
      doctorName: doctorProfile2.fullName,
      appointmentId: 'apt_1002',
      amount: 150,
      date: '2026-10-26',
      status: 'paid',
      paymentMethod: 'HSA / Flex Card ending in 1088 (Simulated)',
      receiptNumber: 'REC-2026-89411',
    },
    {
      id: 'inv_7000',
      patientId: patientUser.id,
      patientName: patientUser.name,
      doctorId: doctorUser1.id,
      doctorName: doctorProfile1.fullName,
      appointmentId: 'apt_0998',
      amount: 120,
      date: '2026-09-15',
      status: 'paid',
      paymentMethod: 'Visa ending in 7732 (Simulated)',
      receiptNumber: 'REC-2026-78119',
    },
  ];

  const auditLogs: AuditLogItem[] = [
    {
      id: 'log_001',
      timestamp: '2026-10-25T11:20:00Z',
      actorId: patientUser.id,
      actorName: patientUser.name,
      actorRole: 'patient',
      action: 'BOOK_APPOINTMENT',
      details: 'Booked appointment apt_1001 with Dr. Sarah Chen (Cardiology)',
      ipAddress: '192.168.1.42',
    },
    {
      id: 'log_002',
      timestamp: '2026-10-25T11:21:00Z',
      actorId: 'system',
      actorName: 'MediConnect Engine',
      actorRole: 'admin',
      action: 'GENERATE_INVOICE',
      details: 'Created receipt REC-2026-89410 for $120.00',
      ipAddress: '127.0.0.1',
    },
    {
      id: 'log_003',
      timestamp: '2026-09-15T11:42:00Z',
      actorId: doctorUser1.id,
      actorName: doctorProfile1.fullName,
      actorRole: 'doctor',
      action: 'ISSUE_PRESCRIPTION',
      details: 'Signed electronic prescription rx_8001 for patient Alex Morgan',
      ipAddress: '10.20.4.18',
    },
  ];

  return {
    users: [patientUser, doctorUser1, doctorUser2, doctorUser3, adminUser],
    patientProfiles: [patientProfile],
    doctorProfiles: [doctorProfile1, doctorProfile2, doctorProfile3],
    appointments,
    prescriptions,
    records,
    labReports,
    messages,
    notifications,
    invoices,
    auditLogs,
  };
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed reading DB file, re-initializing with seed data:', e);
    }

    const seed = getInitialSeedData();
    this.persist(seed);
    return seed;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  }

  public resetDemoData() {
    this.data = getInitialSeedData();
    this.persist();
    return true;
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public createUser(userData: {
    name: string;
    email: string;
    role: 'patient' | 'doctor';
    password: string;
    phone?: string;
  }) {
    if (this.findUserByEmail(userData.email)) {
      throw new Error('A user with this email address already exists');
    }

    const id = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
    const newUser = {
      id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || '',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(userData.password),
    };

    this.data.users.push(newUser);

    if (userData.role === 'patient') {
      const patientProfile: PatientProfile = {
        id: `pat_${Date.now().toString(36)}`,
        userId: id,
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        dob: '1995-01-01',
        gender: 'Other',
        bloodGroup: 'Not specified',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        emergencyContact: { name: '', relationship: '', phone: '' },
        address: '',
      };
      this.data.patientProfiles.push(patientProfile);
    } else if (userData.role === 'doctor') {
      const doctorProfile: DoctorProfile = {
        id: `doc_${Date.now().toString(36)}`,
        userId: id,
        fullName: userData.name,
        title: 'Physician / Medical Specialist',
        specialty: 'General Medicine',
        experienceYears: 1,
        consultationFee: 80,
        rating: 5.0,
        reviewCount: 0,
        clinicAddress: 'MediConnect Health Suite',
        hospitalAffiliation: 'MediConnect Partner Network',
        bio: 'Dedicated medical professional prioritizing patient well-being and clinical care.',
        education: ['Doctor of Medicine (MD)'],
        languages: ['English'],
        consultationModes: ['in_person', 'video'],
        slotDurationMinutes: 30,
        schedule: [
          { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
          { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
          { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
          { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '13:00' },
          { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '13:00' },
        ],
        isVerified: true,
        avatarUrl: DOCTOR_IMAGES.SARAH_CHEN,
      };
      this.data.doctorProfiles.push(doctorProfile);
    }

    this.logAudit({
      actorId: id,
      actorName: userData.name,
      actorRole: userData.role,
      action: 'USER_REGISTERED',
      details: `New account registered as ${userData.role}`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  // --- Patient Profiles ---
  public getPatientProfile(userId: string): PatientProfile | undefined {
    return this.data.patientProfiles.find((p) => p.userId === userId);
  }

  public updatePatientProfile(userId: string, updates: Partial<PatientProfile>): PatientProfile {
    let profile = this.data.patientProfiles.find((p) => p.userId === userId);
    if (!profile) {
      profile = {
        id: `pat_${Date.now().toString(36)}`,
        userId,
        fullName: 'Patient',
        email: '',
        phone: '',
        dob: '1995-01-01',
        gender: 'Other',
        bloodGroup: '',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        emergencyContact: { name: '', relationship: '', phone: '' },
        address: '',
      };
      this.data.patientProfiles.push(profile);
    }

    Object.assign(profile, updates);

    // Also sync user's full name if changed
    const user = this.data.users.find((u) => u.id === userId);
    if (user && updates.fullName) {
      user.name = updates.fullName;
    }

    this.logAudit({
      actorId: userId,
      actorName: profile.fullName,
      actorRole: 'patient',
      action: 'UPDATE_HEALTH_PROFILE',
      details: 'Patient updated their clinical health profile',
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return profile;
  }

  // --- Doctor Profiles ---
  public getDoctors(): DoctorProfile[] {
    return this.data.doctorProfiles;
  }

  public getDoctorById(idOrUserId: string): DoctorProfile | undefined {
    return this.data.doctorProfiles.find((d) => d.id === idOrUserId || d.userId === idOrUserId);
  }

  public updateDoctorProfile(userId: string, updates: Partial<DoctorProfile>): DoctorProfile {
    const doctor = this.data.doctorProfiles.find((d) => d.userId === userId);
    if (!doctor) throw new Error('Doctor profile not found');
    Object.assign(doctor, updates);
    this.persist();
    return doctor;
  }

  // --- Appointments & Double Booking Guard ---
  public getAppointments(filter?: { patientId?: string; doctorId?: string }): Appointment[] {
    let list = this.data.appointments;
    if (filter?.patientId) {
      list = list.filter((a) => a.patientId === filter.patientId);
    }
    if (filter?.doctorId) {
      list = list.filter((a) => a.doctorId === filter.doctorId);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public bookAppointment(payload: {
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    type: 'in_person' | 'video';
    reason: string;
  }): Appointment {
    const doctor = this.getDoctorById(payload.doctorId);
    if (!doctor) throw new Error('Selected doctor does not exist');

    const patient = this.findUserById(payload.patientId);
    if (!patient) throw new Error('Patient not found');

    // Concurrency / double booking check: Is this doctor already booked at this date and time?
    const conflict = this.data.appointments.find(
      (a) =>
        a.doctorId === doctor.userId &&
        a.date === payload.date &&
        a.timeSlot === payload.timeSlot &&
        a.status !== 'cancelled'
    );

    if (conflict) {
      throw new Error(`The slot ${payload.timeSlot} on ${payload.date} is already booked for Dr. ${doctor.fullName}. Please select another time.`);
    }

    const appointmentId = `apt_${Date.now().toString(36)}`;
    const appointment: Appointment = {
      id: appointmentId,
      patientId: payload.patientId,
      patientName: patient.name,
      patientPhone: patient.phone || '',
      doctorId: doctor.userId,
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatarUrl,
      date: payload.date,
      timeSlot: payload.timeSlot,
      type: payload.type,
      status: 'confirmed',
      fee: doctor.consultationFee,
      reason: payload.reason,
      meetingLink: payload.type === 'video' ? `https://meet.mediconnect.internal/room-${appointmentId}` : undefined,
      createdAt: new Date().toISOString(),
    };

    this.data.appointments.unshift(appointment);

    // Auto-create invoice
    const invoiceId = `inv_${Date.now().toString(36)}`;
    const invoice: Invoice = {
      id: invoiceId,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.userId,
      doctorName: doctor.fullName,
      appointmentId,
      amount: doctor.consultationFee,
      date: payload.date,
      status: 'paid',
      paymentMethod: 'Simulated Card Payment',
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
    };
    this.data.invoices.unshift(invoice);

    // Notify doctor
    this.addNotification({
      userId: doctor.userId,
      title: 'New Appointment Booked',
      message: `${patient.name} has booked a ${payload.type === 'video' ? 'Video' : 'Clinic'} appointment on ${payload.date} at ${payload.timeSlot}.`,
      type: 'appointment',
      link: '/doctor/appointments',
    });

    // Notify patient
    this.addNotification({
      userId: patient.id,
      title: 'Appointment Confirmed',
      message: `Your appointment with ${doctor.fullName} on ${payload.date} at ${payload.timeSlot} is confirmed.`,
      type: 'appointment',
      link: '/patient/appointments',
    });

    this.logAudit({
      actorId: patient.id,
      actorName: patient.name,
      actorRole: 'patient',
      action: 'BOOK_APPOINTMENT',
      details: `Booked appointment ${appointmentId} with ${doctor.fullName}`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return appointment;
  }

  public updateAppointmentStatus(
    id: string,
    status: Appointment['status'],
    actorUserId: string,
    cancelReason?: string
  ): Appointment {
    const apt = this.data.appointments.find((a) => a.id === id);
    if (!apt) throw new Error('Appointment not found');

    apt.status = status;
    if (cancelReason) {
      apt.cancellationReason = cancelReason;
    }

    this.logAudit({
      actorId: actorUserId,
      actorName: 'User',
      actorRole: 'doctor',
      action: 'UPDATE_APPOINTMENT_STATUS',
      details: `Updated appointment ${id} to ${status}`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return apt;
  }

  public rescheduleAppointment(
    id: string,
    newDate: string,
    newTimeSlot: string,
    actorUserId: string
  ): Appointment {
    const apt = this.data.appointments.find((a) => a.id === id);
    if (!apt) throw new Error('Appointment not found');

    // Conflict check
    const conflict = this.data.appointments.find(
      (a) =>
        a.id !== id &&
        a.doctorId === apt.doctorId &&
        a.date === newDate &&
        a.timeSlot === newTimeSlot &&
        a.status !== 'cancelled'
    );
    if (conflict) {
      throw new Error(`The slot ${newTimeSlot} on ${newDate} is already booked.`);
    }

    apt.date = newDate;
    apt.timeSlot = newTimeSlot;
    apt.status = 'confirmed';

    this.logAudit({
      actorId: actorUserId,
      actorName: apt.patientName,
      actorRole: 'patient',
      action: 'RESCHEDULE_APPOINTMENT',
      details: `Rescheduled appointment ${id} to ${newDate} at ${newTimeSlot}`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return apt;
  }

  // --- Prescriptions ---
  public getPrescriptions(filter?: { patientId?: string; doctorId?: string }): Prescription[] {
    let list = this.data.prescriptions;
    if (filter?.patientId) {
      list = list.filter((p) => p.patientId === filter.patientId);
    }
    if (filter?.doctorId) {
      list = list.filter((p) => p.doctorId === filter.doctorId);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createPrescription(payload: {
    doctorId: string;
    patientId: string;
    appointmentId?: string;
    diagnosis: string;
    clinicalNotes?: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      timing: string;
      instructions: string;
    }>;
    followUpDate?: string;
  }): Prescription {
    const doctor = this.getDoctorById(payload.doctorId);
    if (!doctor) throw new Error('Unauthorized or unknown doctor profile');

    const patient = this.findUserById(payload.patientId);
    if (!patient) throw new Error('Patient not found');

    const prescriptionId = `rx_${Date.now().toString(36)}`;
    const prescription: Prescription = {
      id: prescriptionId,
      appointmentId: payload.appointmentId,
      patientId: payload.patientId,
      patientName: patient.name,
      doctorId: doctor.userId,
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty,
      doctorCredentials: doctor.title,
      clinicName: doctor.clinicAddress,
      date: new Date().toISOString().split('T')[0],
      diagnosis: payload.diagnosis,
      clinicalNotes: payload.clinicalNotes,
      medications: payload.medications.map((m, idx) => ({
        ...m,
        id: `med_${idx + 1}_${Date.now().toString(36)}`,
      })),
      followUpDate: payload.followUpDate,
      isDemoRecord: true,
      signedAt: new Date().toISOString(),
    };

    this.data.prescriptions.unshift(prescription);

    // Notify patient
    this.addNotification({
      userId: patient.id,
      title: 'New Digital Prescription Issued',
      message: `${doctor.fullName} has signed an electronic prescription for: ${payload.diagnosis}`,
      type: 'prescription',
      link: '/patient/prescriptions',
    });

    this.logAudit({
      actorId: doctor.userId,
      actorName: doctor.fullName,
      actorRole: 'doctor',
      action: 'ISSUE_PRESCRIPTION',
      details: `Prescription ${prescriptionId} issued for patient ${patient.name}`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return prescription;
  }

  // --- DRiefcase Medical Records ---
  public getRecords(patientId: string): MedicalRecord[] {
    return this.data.records
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public uploadRecord(payload: {
    patientId: string;
    title: string;
    category: MedicalRecord['category'];
    date: string;
    facility: string;
    doctorName?: string;
    summary: string;
    fileType?: 'PDF' | 'DICOM' | 'JPG';
    tags?: string[];
  }): MedicalRecord {
    const id = `rec_${Date.now().toString(36)}`;
    const record: MedicalRecord = {
      id,
      patientId: payload.patientId,
      title: payload.title,
      category: payload.category,
      date: payload.date || new Date().toISOString().split('T')[0],
      facility: payload.facility,
      doctorName: payload.doctorName,
      summary: payload.summary,
      fileType: payload.fileType || 'PDF',
      fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      isDemo: true,
      tags: payload.tags || ['User Uploaded', 'Health Record'],
      uploadedAt: new Date().toISOString(),
    };

    this.data.records.unshift(record);

    this.logAudit({
      actorId: payload.patientId,
      actorName: 'Patient User',
      actorRole: 'patient',
      action: 'UPLOAD_MEDICAL_RECORD',
      details: `Uploaded ${payload.category} record: "${payload.title}"`,
      ipAddress: '127.0.0.1',
    });

    this.persist();
    return record;
  }

  public deleteRecord(recordId: string, patientId: string): boolean {
    const idx = this.data.records.findIndex((r) => r.id === recordId && r.patientId === patientId);
    if (idx === -1) return false;
    this.data.records.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Lab Reports ---
  public getLabReports(patientId: string): LabReport[] {
    return this.data.labReports.filter((l) => l.patientId === patientId);
  }

  // --- Messages ---
  public getMessages(conversationId: string): MessageItem[] {
    return this.data.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getAllUserConversations(userId: string) {
    const messages = this.data.messages.filter(
      (m) => m.senderId === userId || m.recipientId === userId
    );

    const partnerMap = new Map<string, { lastMessage: MessageItem; unreadCount: number }>();

    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
      const existing = partnerMap.get(partnerId);
      const isUnread = !msg.read && msg.recipientId === userId;

      if (!existing || new Date(msg.timestamp) > new Date(existing.lastMessage.timestamp)) {
        partnerMap.set(partnerId, {
          lastMessage: msg,
          unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unreadCount += 1;
      }
    }

    const conversations = [];
    for (const [partnerId, data] of partnerMap.entries()) {
      const partnerUser = this.findUserById(partnerId);
      const doctorProfile = this.getDoctorById(partnerId);
      conversations.push({
        partnerId,
        partnerName: doctorProfile?.fullName || partnerUser?.name || 'User',
        partnerRole: partnerUser?.role || 'user',
        partnerAvatar: doctorProfile?.avatarUrl || partnerUser?.avatarUrl,
        specialty: doctorProfile?.specialty,
        lastMessage: data.lastMessage,
        unreadCount: data.unreadCount,
      });
    }

    return conversations;
  }

  public sendMessage(payload: {
    senderId: string;
    recipientId: string;
    content: string;
  }): MessageItem {
    const sender = this.findUserById(payload.senderId);
    if (!sender) throw new Error('Sender not found');

    const conversationId = [payload.senderId, payload.recipientId].sort().join('_');
    const msg: MessageItem = {
      id: `msg_${Date.now().toString(36)}`,
      conversationId: `conv_${conversationId}`,
      senderId: payload.senderId,
      senderName: sender.name,
      senderRole: sender.role,
      recipientId: payload.recipientId,
      content: payload.content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.data.messages.push(msg);

    this.addNotification({
      userId: payload.recipientId,
      title: 'New Message',
      message: `${sender.name}: ${payload.content.slice(0, 50)}...`,
      type: 'system',
      link: sender.role === 'doctor' ? '/patient/messages' : '/doctor/messages',
    });

    this.persist();
    return msg;
  }

  // --- Notifications ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(payload: {
    userId: string;
    title: string;
    message: string;
    type: NotificationItem['type'];
    link?: string;
  }): NotificationItem {
    const notif: NotificationItem = {
      id: `notif_${Date.now().toString(36)}`,
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      read: false,
      link: payload.link,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  public markNotificationAsRead(id: string, userId: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.persist();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): boolean {
    this.data.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
    return true;
  }

  // --- Invoices ---
  public getInvoices(patientId?: string): Invoice[] {
    if (patientId) {
      return this.data.invoices.filter((i) => i.patientId === patientId);
    }
    return this.data.invoices;
  }

  // --- Admin stats & Audit Logs ---
  public getAdminStats() {
    return {
      totalUsers: this.data.users.length,
      totalPatients: this.data.users.filter((u) => u.role === 'patient').length,
      totalDoctors: this.data.doctorProfiles.length,
      totalAppointments: this.data.appointments.length,
      completedConsultations: this.data.appointments.filter((a) => a.status === 'completed').length,
      totalRevenue: this.data.invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0),
      totalPrescriptions: this.data.prescriptions.length,
      totalRecords: this.data.records.length,
    };
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.data.auditLogs.slice(-50).reverse();
  }

  public logAudit(log: Omit<AuditLogItem, 'id' | 'timestamp'>) {
    const entry: AuditLogItem = {
      id: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.data.auditLogs.push(entry);
    if (this.data.auditLogs.length > 300) {
      this.data.auditLogs = this.data.auditLogs.slice(-200);
    }
  }

  public toggleDoctorVerification(doctorId: string): boolean {
    const doc = this.data.doctorProfiles.find((d) => d.id === doctorId || d.userId === doctorId);
    if (!doc) return false;
    doc.isVerified = !doc.isVerified;
    this.persist();
    return doc.isVerified;
  }
}

export const store = new Store();
