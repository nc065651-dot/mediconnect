import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Appointment, Prescription } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  Users,
  DollarSign,
  Pill,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  Building,
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (path: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDoctorData = async () => {
    try {
      const [aptRes, rxRes] = await Promise.all([
        api.getAppointments(),
        api.getPrescriptions(),
      ]);
      setAppointments(aptRes.appointments);
      setPrescriptions(rxRes.prescriptions);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const handleMarkComplete = async (id: string) => {
    try {
      await api.updateAppointmentStatus(id, 'completed');
      showToast('Consultation marked as completed');
      await loadDoctorData();
    } catch (err: any) {
      showToast('Failed to update appointment', 'error');
    }
  };

  const upcomingApts = appointments.filter((a) => a.status === 'confirmed');
  const completedApts = appointments.filter((a) => a.status === 'completed');
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.fee, 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cardiovascular Clinical Suite Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Clinical Desk — {user?.name || 'Dr. Sarah Chen, MD'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            You have <strong className="text-white font-mono-numbers">{upcomingApts.length}</strong> active patient consultation{upcomingApts.length === 1 ? '' : 's'} scheduled for today and this week.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/doctor/prescriptions')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write E-Prescription</span>
          </button>
          <button
            onClick={() => onNavigate('/doctor/schedule')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Manage Hours</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Scheduled Visits</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{upcomingApts.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Completed Consults</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{completedApts.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Issued e-Rx</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{prescriptions.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">${totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Consultations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Schedule Queue */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Patient Consultation Queue</h2>
                <p className="text-xs text-slate-500">Upcoming clinical appointments requiring physician attention</p>
              </div>
              <button
                onClick={() => onNavigate('/doctor/appointments')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : upcomingApts.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No active appointments queued. Your schedule is clear.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingApts.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-500/50 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{apt.patientName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 uppercase">
                          {apt.type === 'video' ? 'Virtual Video' : 'Clinic Visit'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{apt.reason}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1 font-mono-numbers">
                          <Calendar className="w-3 h-3 text-teal-700" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono-numbers">
                          <Clock className="w-3 h-3 text-teal-700" />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.type === 'video' && (
                        <button
                          onClick={() => onNavigate(`/doctor/consultations?aptId=${apt.id}`)}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Video</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMarkComplete(apt.id)}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Practice Quick Actions & Prescriptions Issued */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Clinical Shortcuts</h2>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate('/doctor/prescriptions')}
                className="w-full p-3 bg-teal-50 hover:bg-teal-100/80 text-teal-900 font-semibold rounded-2xl transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-teal-700" />
                  <span>Issue New Prescription</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/doctor/patients')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-2xl transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Lookup Patient Medical History</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/doctor/schedule')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-2xl transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Adjust Working Days & Slot Size</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">Prescription Activity</h2>
            <div className="space-y-2 text-xs">
              {prescriptions.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{p.patientName}</span>
                    <span className="text-slate-400 font-mono-numbers">{p.date}</span>
                  </div>
                  <p className="text-[11px] text-teal-800 truncate mt-0.5">{p.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
