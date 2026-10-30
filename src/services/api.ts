import type {
  User,
  DoctorProfile,
  Appointment,
  Prescription,
  MedicalRecord,
  LabReport,
  MessageItem,
  NotificationItem,
  Invoice,
  PatientProfile,
  AuditLogItem,
} from '../types.ts';

const TOKEN_KEY = 'mediconnect_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email?: string; password?: string; demoRole?: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string; role: 'patient' | 'doctor'; phone?: string }) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  // Doctors
  getDoctors: (params?: { specialty?: string; search?: string; consultationType?: string }) => {
    const query = new URLSearchParams();
    if (params?.specialty) query.set('specialty', params.specialty);
    if (params?.search) query.set('search', params.search);
    if (params?.consultationType) query.set('consultationType', params.consultationType);
    return request<{ doctors: DoctorProfile[] }>(`/doctors?${query.toString()}`);
  },

  getDoctor: (id: string) => request<{ doctor: DoctorProfile }>(`/doctors/${id}`),

  // Appointments
  getAppointments: () => request<{ appointments: Appointment[] }>('/appointments'),

  bookAppointment: (payload: {
    doctorId: string;
    date: string;
    timeSlot: string;
    type: 'in_person' | 'video';
    reason: string;
  }) =>
    request<{ appointment: Appointment }>('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  rescheduleAppointment: (id: string, payload: { newDate: string; newTimeSlot: string }) =>
    request<{ appointment: Appointment }>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  cancelAppointment: (id: string, reason: string) =>
    request<{ appointment: Appointment }>(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  updateAppointmentStatus: (id: string, status: Appointment['status']) =>
    request<{ appointment: Appointment }>(`/appointments/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Prescriptions
  getPrescriptions: () => request<{ prescriptions: Prescription[] }>('/prescriptions'),

  createPrescription: (payload: {
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
  }) =>
    request<{ prescription: Prescription }>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Medical Records (DRiefcase)
  getRecords: (patientId?: string) => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return request<{ records: MedicalRecord[] }>(`/records${query}`);
  },

  uploadRecord: (payload: {
    title: string;
    category: MedicalRecord['category'];
    date: string;
    facility: string;
    doctorName?: string;
    summary: string;
    fileType?: 'PDF' | 'DICOM' | 'JPG';
    tags?: string[];
  }) =>
    request<{ record: MedicalRecord }>('/records', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteRecord: (id: string) =>
    request<{ success: boolean }>(`/records/${id}`, {
      method: 'DELETE',
    }),

  // Lab Reports
  getLabReports: (patientId?: string) => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return request<{ labReports: LabReport[] }>(`/lab-reports${query}`);
  },

  // Health Profile
  getPatientProfile: (patientId?: string) => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return request<{ profile: PatientProfile }>(`/patient/profile${query}`);
  },

  updatePatientProfile: (profile: Partial<PatientProfile>) =>
    request<{ profile: PatientProfile }>('/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Doctor Profile & Schedule
  getDoctorProfile: () => request<{ doctor: DoctorProfile }>('/doctor/profile'),

  updateDoctorProfile: (profile: Partial<DoctorProfile>) =>
    request<{ doctor: DoctorProfile }>('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Messages
  getConversations: () => request<{ conversations: any[] }>('/messages/conversations'),

  getMessageThread: (partnerId: string) =>
    request<{ messages: MessageItem[] }>(`/messages/thread?partnerId=${partnerId}`),

  sendMessage: (recipientId: string, content: string) =>
    request<{ message: MessageItem }>('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, content }),
    }),

  // Notifications
  getNotifications: () => request<{ notifications: NotificationItem[] }>('/notifications'),

  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'POST',
    }),

  markAllNotificationsRead: () =>
    request<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    }),

  // Invoices
  getInvoices: () => request<{ invoices: Invoice[] }>('/invoices'),

  // Admin
  getAdminStats: () => request<{ stats: any }>('/admin/stats'),

  getAuditLogs: () => request<{ auditLogs: AuditLogItem[] }>('/admin/audit-logs'),

  toggleDoctorVerification: (id: string) =>
    request<{ isVerified: boolean }>(`/admin/doctors/${id}/toggle-verify`, {
      method: 'POST',
    }),

  resetDemoData: () =>
    request<{ success: boolean; message: string }>('/admin/reset-demo', {
      method: 'POST',
    }),
};
