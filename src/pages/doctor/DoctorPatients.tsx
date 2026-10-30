import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { PatientProfile, MedicalRecord } from '../../types.ts';
import { Users, AlertTriangle, Heart, Pill, FolderHeart, Eye, ArrowRight } from 'lucide-react';

export const DoctorPatients: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profRes, recRes] = await Promise.all([
          api.getPatientProfile('user_pat_01'),
          api.getRecords('user_pat_01'),
        ]);
        setProfile(profRes.profile);
        setRecords(recRes.records);
      } catch (err) {
        console.error('Failed to load patient data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized clinical records, allergy profiles, and consultation histories for under-care patients
        </p>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
      ) : profile ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {profile.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{profile.fullName}</h2>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {profile.bloodGroup}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  DOB: <span className="font-mono-numbers">{profile.dob}</span> · Gender: {profile.gender} · Phone: {profile.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/doctor/prescriptions')}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Write Prescription</span>
              </button>
            </div>
          </div>

          {/* Clinical Alerts Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Allergies & Contraindications</span>
              </div>
              <p className="text-rose-900 font-medium">
                {profile.allergies.length ? profile.allergies.join(', ') : 'No documented allergies'}
              </p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                <Heart className="w-4 h-4" />
                <span>Active Chronic Conditions</span>
              </div>
              <p className="text-teal-900 font-medium">
                {profile.chronicConditions.length ? profile.chronicConditions.join(', ') : 'None documented'}
              </p>
            </div>
          </div>

          {/* Current Medical Records Vault */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FolderHeart className="w-4 h-4 text-teal-700" />
                <h3>Authorized Diagnostic Documents ({records.length})</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {records.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 truncate">{r.title}</h4>
                    <span className="font-mono-numbers text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {r.fileType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{r.facility} · {r.date}</p>
                  <p className="text-slate-600 line-clamp-2 mt-1">{r.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-800">No active patient relationship selected</p>
        </div>
      )}
    </div>
  );
};
