import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Search,
  CalendarPlus,
  Calendar,
  Video,
  FolderHeart,
  Pill,
  FileSpreadsheet,
  UserCheck,
  Bell,
  MessageSquare,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Activity,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface PatientLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Find Doctors', path: '/doctors', icon: Search },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Online Consultation', path: '/patient/consultations', icon: Video },
    { label: 'Medical Records', path: '/patient/records', icon: FolderHeart, badge: 'DRiefcase' },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { label: 'Lab Reports', path: '/patient/lab-reports', icon: FileSpreadsheet },
    { label: 'My Health Profile', path: '/patient/profile', icon: UserCheck },
    { label: 'Notifications', path: '/patient/notifications', icon: Bell },
    { label: 'Messages', path: '/patient/messages', icon: MessageSquare },
    { label: 'Billing & Payments', path: '/patient/billing', icon: CreditCard },
    { label: 'Help & Support', path: '/patient/support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </span>
          <span className="font-bold text-slate-900 tracking-tight">MediConnect</span>
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
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-base block">MediConnect</span>
                <span className="text-[11px] text-teal-700 font-medium tracking-wide">Patient Health Portal</span>
              </div>
            </button>
          </div>

          {/* User quick badge */}
          <div className="px-4 py-3 mx-3 my-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-700 text-white font-semibold flex items-center justify-center text-xs shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'AM'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Alex Morgan'}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>O+ Positive</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Verified Patient</span>
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
                      ? 'bg-teal-50 text-teal-900 font-semibold border-l-2 border-teal-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom user action & Demo role switcher */}
          <div className="p-3 border-t border-slate-200 bg-white space-y-1">
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>Switch Demo Role</span>
                </div>
                <span className="text-slate-400 text-[10px]">Toggle</span>
              </button>

              {showRoleSwitcher && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      demoLogin('doctor');
                      setShowRoleSwitcher(false);
                      onNavigate('/doctor/dashboard');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-teal-50 text-slate-800 hover:text-teal-900 flex items-center justify-between"
                  >
                    <span>Doctor (Dr. Sarah Chen)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('admin');
                      setShowRoleSwitcher(false);
                      onNavigate('/admin/dashboard');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-teal-50 text-slate-800 hover:text-teal-900 flex items-center justify-between"
                  >
                    <span>Hospital Administrator</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
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
            <span className="text-slate-400">Patient Workspace</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {currentPath.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/patient/notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
            </button>

            <button
              onClick={() => onNavigate('/patient/book-appointment')}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-teal-800 text-white font-semibold flex items-center justify-center text-[10px]">
                {user?.name?.slice(0, 2).toUpperCase() || 'AM'}
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                {user?.name || 'Alex Morgan'}
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
