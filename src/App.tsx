import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { PatientLayout } from './layouts/PatientLayout.tsx';
import { DoctorLayout } from './layouts/DoctorLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Public pages
import { HomePage } from './pages/public/HomePage.tsx';
import { DoctorDirectoryPage } from './pages/public/DoctorDirectoryPage.tsx';
import { DoctorProfilePage } from './pages/public/DoctorProfilePage.tsx';
import { AuthPage } from './pages/public/AuthPage.tsx';

// Patient pages
import { PatientDashboard } from './pages/patient/PatientDashboard.tsx';
import { PatientBookAppointment } from './pages/patient/PatientBookAppointment.tsx';
import { PatientAppointments } from './pages/patient/PatientAppointments.tsx';
import { PatientRecords } from './pages/patient/PatientRecords.tsx';
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions.tsx';
import { PatientLabReports } from './pages/patient/PatientLabReports.tsx';
import { PatientHealthProfile } from './pages/patient/PatientHealthProfile.tsx';
import { PatientBilling } from './pages/patient/PatientBilling.tsx';
import { PatientConsultationRoom } from './pages/patient/PatientConsultationRoom.tsx';
import { PatientMessages } from './pages/patient/PatientMessages.tsx';
import { PatientNotifications } from './pages/patient/PatientNotifications.tsx';

// Doctor pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard.tsx';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments.tsx';
import { DoctorPrescriptionStudio } from './pages/doctor/DoctorPrescriptionStudio.tsx';
import { DoctorPatients } from './pages/doctor/DoctorPatients.tsx';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule.tsx';
import { DoctorEarnings } from './pages/doctor/DoctorEarnings.tsx';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import type { DoctorProfile } from './types.ts';

function AppContent() {
  const { user, isLoading, demoLogin, showToast } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Initializing MediConnect Health System...</p>
        </div>
      </div>
    );
  }

  // Parse dynamic route params (e.g. /doctors/:id)
  const isDoctorProfileRoute = currentPath.startsWith('/doctors/') && currentPath !== '/doctors';
  const doctorIdParam = isDoctorProfileRoute ? currentPath.replace('/doctors/', '') : '';

  // ----------------- RENDER PUBLIC EXPERIENCES -----------------
  if (currentPath === '/' || currentPath === '/records-info' || currentPath === '/how-it-works') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <HomePage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  if (currentPath === '/specialties' || currentPath === '/doctors') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <DoctorDirectoryPage
            onNavigate={navigate}
            onSelectDoctorToBook={(doc) => setSelectedDoctorForBooking(doc)}
          />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  if (isDoctorProfileRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <DoctorProfilePage
            doctorId={doctorIdParam}
            onNavigate={navigate}
            onBookDoctor={(doc) => setSelectedDoctorForBooking(doc)}
          />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  if (currentPath === '/login' || currentPath === '/register') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <AuthPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  // ----------------- ROLE ROUTE GUARDS -----------------
  if (!user) {
    // If user attempted to access protected area, redirect to login
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          <AuthPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  // ----------------- PATIENT PORTAL ROUTES -----------------
  if (currentPath.startsWith('/patient/')) {
    return (
      <PatientLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/patient/dashboard' && <PatientDashboard onNavigate={navigate} />}
        {currentPath.startsWith('/patient/book-appointment') && (
          <PatientBookAppointment
            initialDoctorId={selectedDoctorForBooking?.id}
            onNavigate={navigate}
          />
        )}
        {currentPath === '/patient/appointments' && <PatientAppointments onNavigate={navigate} />}
        {currentPath === '/patient/records' && <PatientRecords onNavigate={navigate} />}
        {currentPath === '/patient/prescriptions' && <PatientPrescriptions />}
        {currentPath === '/patient/lab-reports' && <PatientLabReports />}
        {currentPath === '/patient/profile' && <PatientHealthProfile />}
        {currentPath === '/patient/billing' && <PatientBilling />}
        {currentPath.startsWith('/patient/consultations') && (
          <PatientConsultationRoom onNavigate={navigate} />
        )}
        {currentPath === '/patient/messages' && <PatientMessages />}
        {currentPath === '/patient/notifications' && <PatientNotifications onNavigate={navigate} />}
        {currentPath === '/patient/support' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900">MediConnect Support & Clinical Helpdesk</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you require emergency assistance, please immediately call 911 or visit your nearest emergency department.
            </p>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p><strong>Clinical Helpline:</strong> +1 (800) 555-MEDI (24/7)</p>
              <p><strong>Appointment Desk:</strong> appointments@mediconnect.internal</p>
              <p><strong>Health Records Privacy:</strong> records@mediconnect.internal</p>
            </div>
          </div>
        )}
      </PatientLayout>
    );
  }

  // ----------------- DOCTOR PORTAL ROUTES -----------------
  if (currentPath.startsWith('/doctor/')) {
    return (
      <DoctorLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/doctor/dashboard' && <DoctorDashboard onNavigate={navigate} />}
        {currentPath === '/doctor/appointments' && <DoctorAppointments onNavigate={navigate} />}
        {currentPath === '/doctor/prescriptions' && <DoctorPrescriptionStudio onNavigate={navigate} />}
        {currentPath === '/doctor/patients' && <DoctorPatients onNavigate={navigate} />}
        {currentPath === '/doctor/records' && <DoctorPatients onNavigate={navigate} />}
        {currentPath === '/doctor/schedule' && <DoctorSchedule />}
        {currentPath === '/doctor/earnings' && <DoctorEarnings />}
        {currentPath === '/doctor/reviews' && <DoctorEarnings />}
        {currentPath === '/doctor/profile' && <DoctorSchedule />}
        {currentPath.startsWith('/doctor/consultations') && (
          <PatientConsultationRoom onNavigate={navigate} />
        )}
        {currentPath === '/doctor/messages' && <PatientMessages />}
        {currentPath === '/doctor/notifications' && <PatientNotifications onNavigate={navigate} />}
        {currentPath === '/doctor/support' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Physician Technical Support Desk</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assistance with electronic signature keys, laboratory integrations, or schedule sync.
            </p>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p><strong>Physician Dedicated Line:</strong> +1 (800) 555-DOCS</p>
              <p><strong>EHR Integration Support:</strong> ehr@mediconnect.internal</p>
            </div>
          </div>
        )}
      </DoctorLayout>
    );
  }

  // ----------------- ADMIN PORTAL ROUTES -----------------
  if (currentPath.startsWith('/admin/')) {
    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        <HomePage onNavigate={navigate} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
