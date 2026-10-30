import express, { Request, Response, NextFunction } from 'express';
import { store, verifyPassword } from './store.ts';

export const apiRouter = express.Router();

// Simple auth middleware reading authorization token (stored as user ID for demo simplicity & security)
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const user = store.findUserById(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }

  (req as any).user = user;
  next();
}

// Optional auth middleware (attaches user if token present)
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const user = store.findUserById(token);
    if (user) {
      (req as any).user = user;
    }
  }
  next();
}

// ----------------- AUTH ROUTES -----------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, demoRole } = req.body;

  // 1-Click Demo Login support for presentation
  if (demoRole) {
    let targetEmail = 'patient@mediconnect.demo';
    if (demoRole === 'doctor') targetEmail = 'doctor@mediconnect.demo';
    if (demoRole === 'admin') targetEmail = 'admin@mediconnect.demo';

    const demoUser = store.findUserByEmail(targetEmail);
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found' });
    }
    const { passwordHash: _, ...safeUser } = demoUser;
    return res.json({ token: safeUser.id, user: safeUser });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ token: safeUser.id, user: safeUser });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    if (role !== 'patient' && role !== 'doctor') {
      return res.status(400).json({ error: 'Invalid role. Must be patient or doctor.' });
    }

    const newUser = store.createUser({ name, email, password, role, phone });
    res.status(201).json({ token: newUser.id, user: newUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

apiRouter.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user });
});

// ----------------- DOCTOR DIRECTORY -----------------
apiRouter.get('/doctors', (req: Request, res: Response) => {
  const { specialty, search, consultationType } = req.query;
  let doctors = store.getDoctors();

  if (specialty && typeof specialty === 'string' && specialty !== 'All') {
    doctors = doctors.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.subSpecialty?.toLowerCase().includes(q) ||
        d.clinicAddress.toLowerCase().includes(q)
    );
  }

  if (consultationType && typeof consultationType === 'string') {
    doctors = doctors.filter((d) =>
      d.consultationModes.includes(consultationType as 'in_person' | 'video')
    );
  }

  res.json({ doctors });
});

apiRouter.get('/doctors/:id', (req: Request, res: Response) => {
  const doctor = store.getDoctorById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  res.json({ doctor });
});

// ----------------- APPOINTMENTS -----------------
apiRouter.get('/appointments', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  let appointments;

  if (user.role === 'doctor') {
    appointments = store.getAppointments({ doctorId: user.id });
  } else if (user.role === 'patient') {
    appointments = store.getAppointments({ patientId: user.id });
  } else {
    // Admin sees all
    appointments = store.getAppointments();
  }

  res.json({ appointments });
});

apiRouter.post('/appointments/book', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const { doctorId, date, timeSlot, type, reason } = req.body;

    if (!doctorId || !date || !timeSlot || !type) {
      return res.status(400).json({ error: 'doctorId, date, timeSlot, and type are required' });
    }

    const appointment = store.bookAppointment({
      patientId: user.id,
      doctorId,
      date,
      timeSlot,
      type,
      reason: reason || 'General clinical consultation',
    });

    res.status(201).json({ appointment });
  } catch (error: any) {
    res.status(409).json({ error: error.message || 'Slot booking collision or invalid request' });
  }
});

apiRouter.post('/appointments/:id/reschedule', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { newDate, newTimeSlot } = req.body;
  if (!newDate || !newTimeSlot) {
    return res.status(400).json({ error: 'newDate and newTimeSlot are required' });
  }

  try {
    const updated = store.rescheduleAppointment(req.params.id, newDate, newTimeSlot, user.id);
    res.json({ appointment: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Rescheduling failed' });
  }
});

apiRouter.post('/appointments/:id/cancel', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { reason } = req.body;

  try {
    const updated = store.updateAppointmentStatus(
      req.params.id,
      'cancelled',
      user.id,
      reason || 'Cancelled by user request'
    );
    res.json({ appointment: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Cancellation failed' });
  }
});

apiRouter.post('/appointments/:id/status', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { status } = req.body;

  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status transition' });
  }

  try {
    const updated = store.updateAppointmentStatus(req.params.id, status, user.id);
    res.json({ appointment: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Status update failed' });
  }
});

// ----------------- PRESCRIPTIONS -----------------
apiRouter.get('/prescriptions', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  let prescriptions;

  if (user.role === 'doctor') {
    prescriptions = store.getPrescriptions({ doctorId: user.id });
  } else if (user.role === 'patient') {
    prescriptions = store.getPrescriptions({ patientId: user.id });
  } else {
    prescriptions = store.getPrescriptions();
  }

  res.json({ prescriptions });
});

apiRouter.post('/prescriptions', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;

  // Authorization: Only doctors can sign e-prescriptions
  if (user.role !== 'doctor') {
    return res.status(403).json({ error: 'Access denied: Only authorized clinicians can issue prescriptions' });
  }

  try {
    const { patientId, diagnosis, clinicalNotes, medications, followUpDate, appointmentId } = req.body;
    if (!patientId || !diagnosis || !medications || !medications.length) {
      return res.status(400).json({ error: 'Patient ID, diagnosis, and at least one medication are required' });
    }

    const prescription = store.createPrescription({
      doctorId: user.id,
      patientId,
      appointmentId,
      diagnosis,
      clinicalNotes,
      medications,
      followUpDate,
    });

    res.status(201).json({ prescription });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Prescription creation failed' });
  }
});

// ----------------- MEDICAL RECORDS (DRIEFECASE) -----------------
apiRouter.get('/records', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const requestedPatientId = (req.query.patientId as string) || user.id;

  // Patient can only view their own; Doctor can view requested patient records
  if (user.role === 'patient' && requestedPatientId !== user.id) {
    return res.status(403).json({ error: 'Unauthorized record access' });
  }

  const records = store.getRecords(requestedPatientId);
  res.json({ records });
});

apiRouter.post('/records', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const { title, category, date, facility, doctorName, summary, fileType, tags } = req.body;

    if (!title || !category || !facility) {
      return res.status(400).json({ error: 'Title, category, and healthcare facility are required' });
    }

    const record = store.uploadRecord({
      patientId: user.id,
      title,
      category,
      date,
      facility,
      doctorName,
      summary: summary || 'Patient uploaded clinical document',
      fileType,
      tags,
    });

    res.status(201).json({ record });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Record upload failed' });
  }
});

apiRouter.delete('/records/:id', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const deleted = store.deleteRecord(req.params.id, user.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Record not found or unauthorized to delete' });
  }
  res.json({ success: true });
});

// ----------------- LAB REPORTS -----------------
apiRouter.get('/lab-reports', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const patientId = (req.query.patientId as string) || user.id;

  if (user.role === 'patient' && patientId !== user.id) {
    return res.status(403).json({ error: 'Unauthorized lab report access' });
  }

  const labReports = store.getLabReports(patientId);
  res.json({ labReports });
});

// ----------------- HEALTH PROFILES -----------------
apiRouter.get('/patient/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const targetPatientId = (req.query.patientId as string) || user.id;

  const profile = store.getPatientProfile(targetPatientId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json({ profile });
});

apiRouter.put('/patient/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const updated = store.updatePatientProfile(user.id, req.body);
    res.json({ profile: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
});

// ----------------- DOCTOR SCHEDULE & PROFILE -----------------
apiRouter.get('/doctor/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access required' });
  }
  const doctor = store.getDoctorById(user.id);
  res.json({ doctor });
});

apiRouter.put('/doctor/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access required' });
  }
  try {
    const updated = store.updateDoctorProfile(user.id, req.body);
    res.json({ doctor: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update doctor profile' });
  }
});

// ----------------- MESSAGES -----------------
apiRouter.get('/messages/conversations', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const conversations = store.getAllUserConversations(user.id);
  res.json({ conversations });
});

apiRouter.get('/messages/thread', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const partnerId = req.query.partnerId as string;
  if (!partnerId) {
    return res.status(400).json({ error: 'partnerId parameter is required' });
  }

  const conversationId = `conv_${[user.id, partnerId].sort().join('_')}`;
  const messages = store.getMessages(conversationId);
  res.json({ messages });
});

apiRouter.post('/messages', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { recipientId, content } = req.body;
  if (!recipientId || !content) {
    return res.status(400).json({ error: 'Recipient and content are required' });
  }

  try {
    const message = store.sendMessage({
      senderId: user.id,
      recipientId,
      content,
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Message dispatch failed' });
  }
});

// ----------------- NOTIFICATIONS -----------------
apiRouter.get('/notifications', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const notifications = store.getNotifications(user.id);
  res.json({ notifications });
});

apiRouter.post('/notifications/:id/read', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  store.markNotificationAsRead(req.params.id, user.id);
  res.json({ success: true });
});

apiRouter.post('/notifications/read-all', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  store.markAllNotificationsAsRead(user.id);
  res.json({ success: true });
});

// ----------------- INVOICES & BILLING -----------------
apiRouter.get('/invoices', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const invoices = user.role === 'patient' ? store.getInvoices(user.id) : store.getInvoices();
  res.json({ invoices });
});

// ----------------- ADMIN -----------------
apiRouter.get('/admin/stats', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  const stats = store.getAdminStats();
  res.json({ stats });
});

apiRouter.get('/admin/audit-logs', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  const auditLogs = store.getAuditLogs();
  res.json({ auditLogs });
});

apiRouter.post('/admin/reset-demo', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  store.resetDemoData();
  res.json({ success: true, message: 'Demo dataset reset to pristine demonstration state' });
});

apiRouter.post('/admin/doctors/:id/toggle-verify', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  const status = store.toggleDoctorVerification(req.params.id);
  res.json({ isVerified: status });
});
