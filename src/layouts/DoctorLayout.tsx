import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FolderLock,
  Pill,
  Clock,
  Video,
  MessageSquare,
  DollarSign,
  Star,
  UserCheck,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Activity,
  Shield,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface DoctorLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', path: '/doctor/appointments', icon: CalendarCheck },
    { label: 'Patient Management', path: '/doctor/patients', icon: Users },
    { label: 'Patient Records', path: '/doctor/records', icon: FolderLock },
    { label: 'Write Prescription', path: '/doctor/prescriptions', icon: Pill, highlight: true },
    { label: 'Availability & Schedule', path: '/doctor/schedule', icon: Clock },
    { label: 'Online Consultations', path: '/doctor/consultations', icon: Video },
    { label: 'Messages', path: '/doctor/messages', icon: MessageSquare },
    { label: 'Earnings & Payments', path: '/doctor/earnings', icon: DollarSign },
    { label: 'Reviews & Feedback', path: '/doctor/reviews', icon: Star },
    { label: 'Professional Profile', path: '/doctor/profile', icon: UserCheck },
    { label: 'Notifications', path: '/doctor/notifications', icon: Bell },
    { label: 'Help & Support', path: '/doctor/support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </span>
          <span className="font-bold text-slate-900 tracking-tight">MediConnect Clinical</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <span className="font-bold text-white tracking-tight text-base block">MediConnect</span>
                <span className="text-[11px] text-teal-400 font-medium tracking-wide">Physician Suite</span>
              </div>
            </button>
          </div>

          {/* Doctor status badge */}
          <div className="px-4 py-3 mx-3 my-2 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center text-xs shrink-0 overflow-hidden">
              <img
                src="/src/assets/images/doctor_sarah_chen_1793264706983.jpg"
                alt="Doctor Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Dr. Sarah Chen, MD'}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Cardiology</span>
                <span>·</span>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`text-[10px] font-medium ${isAvailable ? 'text-teal-400' : 'text-amber-400'}`}
                >
                  {isAvailable ? 'Available' : 'Busy'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-teal-600/20 text-teal-300 font-semibold border-l-2 border-teal-500'
                      : item.highlight
                      ? 'text-teal-300 hover:bg-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : item.highlight ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] uppercase font-bold text-teal-300 bg-teal-900/60 px-1.5 py-0.5 rounded">
                      e-Rx
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom user action & Demo role switcher */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-1">
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>Switch Demo Role</span>
                </div>
                <span className="text-slate-500 text-[10px]">Toggle</span>
              </button>

              {showRoleSwitcher && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      demoLogin('patient');
                      setShowRoleSwitcher(false);
                      onNavigate('/patient/dashboard');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Patient (Alex Morgan)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('admin');
                      setShowRoleSwitcher(false);
                      onNavigate('/admin/dashboard');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Hospital Administrator</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">MediConnect</span>
            <span>/</span>
            <span className="text-slate-400">Clinical Desk</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {currentPath.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/doctor/prescriptions')}
              className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Issue Prescription</span>
            </button>

            <button
              onClick={() => onNavigate('/doctor/notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-left">
              <span className="text-xs font-semibold text-slate-800">
                {user?.name || 'Dr. Sarah Chen, MD'}
              </span>
              <span className="text-[11px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                Senior Cardiologist
              </span>
            </div>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
