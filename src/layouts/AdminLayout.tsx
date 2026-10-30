import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShieldAlert,
  Users,
  UserCheck,
  FileText,
  RotateCcw,
  LogOut,
  Activity,
  ArrowLeftRight,
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout, demoLogin } = useAuth();

  const navItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldAlert },
    { label: 'Doctor Approvals', path: '/admin/doctors', icon: UserCheck },
    { label: 'System Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <span className="font-bold text-white tracking-tight text-base block">MediConnect</span>
                <span className="text-[11px] text-teal-400 font-medium tracking-wide">Hospital Administration</span>
              </div>
            </button>
          </div>

          <div className="p-4 mx-3 my-3 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>{user?.name || 'Chief Clinical Admin'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Full System Supervisory Access</p>
          </div>

          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-teal-600/20 text-teal-300 font-semibold border-l-2 border-teal-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 font-medium px-1 flex items-center justify-between">
            <span>Demo Role Switch</span>
            <ArrowLeftRight className="w-3 h-3 text-slate-400" />
          </div>
          <button
            onClick={() => {
              demoLogin('patient');
              onNavigate('/patient/dashboard');
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            Switch to Patient (Alex Morgan)
          </button>
          <button
            onClick={() => {
              demoLogin('doctor');
              onNavigate('/doctor/dashboard');
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            Switch to Doctor (Dr. Sarah Chen)
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
