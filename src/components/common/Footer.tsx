import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 text-white font-bold text-lg mb-3">
              <span className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </span>
              <span>MediConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Integrated clinical healthcare ecosystem connecting patients, licensed physicians, and diagnostic laboratories with secure medical record storage.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>HIPAA Compliant Data Protocol Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">For Patients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate?.('/doctors')} className="hover:text-white transition-colors">
                  Find Verified Doctors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('/records-info')} className="hover:text-white transition-colors">
                  DRiefcase Health Records
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('/specialties')} className="hover:text-white transition-colors">
                  Consultation Specialties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('/login')} className="hover:text-white transition-colors">
                  Patient Portal Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">For Doctors & Clinics</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate?.('/login')} className="hover:text-white transition-colors">
                  Doctor Practice Portal
                </button>
              </li>
              <li>
                <span className="text-slate-500">Electronic Prescriptions (e-Rx)</span>
              </li>
              <li>
                <span className="text-slate-500">Telehealth Video Suite</span>
              </li>
              <li>
                <span className="text-slate-500">Clinical Calendar Sync</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Academic & Demo Note</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              MediConnect is an integrated university hospital management demonstration prototype combining elements of Practo, MFine, and DRiefcase.
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Prepared for college presentation</span>
              <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} MediConnect Healthcare Network. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
