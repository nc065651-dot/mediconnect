import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Activity, ShieldCheck, User, Stethoscope, ShieldAlert, ArrowRight, Lock, Mail, Phone } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { login, register, demoLogin, showToast } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Auth context sets user, we route accordingly
      const targetUser = JSON.parse(localStorage.getItem('mediconnect_user') || '{}');
      if (email.includes('doctor')) onNavigate('/doctor/dashboard');
      else if (email.includes('admin')) onNavigate('/admin/dashboard');
      else onNavigate('/patient/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await register({ name, email, password, role, phone });
      if (role === 'doctor') onNavigate('/doctor/dashboard');
      else onNavigate('/patient/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = async (targetRole: 'patient' | 'doctor' | 'admin') => {
    setIsSubmitting(true);
    try {
      await demoLogin(targetRole);
      if (targetRole === 'patient') onNavigate('/patient/dashboard');
      else if (targetRole === 'doctor') onNavigate('/doctor/dashboard');
      else onNavigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize demo role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 1-Click Evaluation Bar for College Professor */}
      <div className="mb-10 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 md:p-8 text-white shadow-lg border border-teal-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Demonstration Environment · Instant Role Switch</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold">Presenting to Professor or Reviewer?</h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Skip manual typing and experience all three integrated portals with complete seeded appointments, medical records, and prescriptions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => handleDemoAccess('patient')}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-teal-500/30 text-teal-300 flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                Enter →
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mt-3">Patient Portal</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Alex Morgan (O+ Positive)</p>
            <p className="text-[10px] text-teal-200 mt-2">Appointments, DRiefcase records, e-Rx</p>
          </button>

          <button
            onClick={() => handleDemoAccess('doctor')}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-teal-500/30 text-teal-300 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                Enter →
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mt-3">Doctor Portal</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Dr. Sarah Chen, MD (Cardiology)</p>
            <p className="text-[10px] text-teal-200 mt-2">Clinical schedule, e-prescriptions, patients</p>
          </button>

          <button
            onClick={() => handleDemoAccess('admin')}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-slate-700 text-teal-300 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
                Enter →
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mt-3">Hospital Admin</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Chief Supervisory Officer</p>
            <p className="text-[10px] text-teal-200 mt-2">Doctor verification & security audit trail</p>
          </button>
        </div>
      </div>

      {/* Standard Form Box */}
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {tab === 'login' ? 'Sign In to MediConnect' : 'Create an Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access secure medical records and clinical consultations
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="patient@mediconnect.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Demo credentials are listed above for immediate access', 'info')}
                  className="text-[11px] text-teal-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                    role === 'patient'
                      ? 'bg-teal-50 border-teal-600 text-teal-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                    role === 'doctor'
                      ? 'bg-teal-50 border-teal-600 text-teal-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Practicing Physician
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Doe'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
