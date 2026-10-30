import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Activity, ShieldCheck, ChevronDown, User, LogOut } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const { user, logout, demoLogin } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left text-slate-900 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </span>
          <span>MediConnect</span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('/doctors')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 ${
              currentPath === '/doctors' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Find Doctors
          </button>
          <button
            onClick={() => onNavigate('/specialties')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 ${
              currentPath === '/specialties' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Specialties
          </button>
          <button
            onClick={() => onNavigate('/records-info')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 ${
              currentPath === '/records-info' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Health Locker
          </button>
          <button
            onClick={() => onNavigate('/how-it-works')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 ${
              currentPath === '/how-it-works' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: 1 primary action / portal access */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (user.role === 'patient') onNavigate('/patient/dashboard');
                  else if (user.role === 'doctor') onNavigate('/doctor/dashboard');
                  else onNavigate('/admin/dashboard');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Go to {user.role === 'patient' ? 'Patient Portal' : user.role === 'doctor' ? 'Doctor Portal' : 'Admin Portal'}</span>
              </button>
              <button
                onClick={() => logout()}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200/80 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 text-teal-600" />
                </button>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
              </div>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Instant Demo Logins
                  </div>
                  <button
                    onClick={() => {
                      demoLogin('patient');
                      setShowDemoMenu(false);
                      onNavigate('/patient/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-50 text-slate-800 hover:text-teal-900 font-medium transition-colors flex items-center justify-between"
                  >
                    <span>Patient (Alex Morgan)</span>
                    <span className="text-slate-400 text-[10px]">O+ · Prescriptions</span>
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('doctor');
                      setShowDemoMenu(false);
                      onNavigate('/doctor/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-50 text-slate-800 hover:text-teal-900 font-medium transition-colors flex items-center justify-between"
                  >
                    <span>Doctor (Dr. Sarah Chen)</span>
                    <span className="text-slate-400 text-[10px]">MD · Cardiology</span>
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('admin');
                      setShowDemoMenu(false);
                      onNavigate('/admin/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-teal-50 text-slate-800 hover:text-teal-900 font-medium transition-colors flex items-center justify-between"
                  >
                    <span>Hospital Administrator</span>
                    <span className="text-slate-400 text-[10px]">Audit Logs</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
