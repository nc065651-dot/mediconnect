import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Appointment } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  XCircle,
  Pill,
  RotateCcw,
  User,
  ArrowRight,
} from 'lucide-react';

export const DoctorAppointments: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const loadAppointments = async () => {
    try {
      const res = await api.getAppointments();
      setAppointments(res.appointments);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    try {
      await api.updateAppointmentStatus(id, status);
      showToast(`Appointment status changed to ${status}`);
      await loadAppointments();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Appointments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your patient schedule, mark visits as completed, or join live telehealth consultations
          </p>
        </div>

        {/* Status filters */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            All ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'confirmed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Confirmed ({appointments.filter((a) => a.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Completed ({appointments.filter((a) => a.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'cancelled' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Cancelled ({appointments.filter((a) => a.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No appointments in this category</p>
          <p className="text-xs text-slate-500">Upcoming clinical bookings will automatically show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{apt.patientName}</span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : apt.status === 'completed'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    · {apt.type === 'video' ? 'Telehealth Video' : 'In-Person Clinic Visit'}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{apt.reason}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-mono-numbers">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-mono-numbers">{apt.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Fee: <strong className="text-slate-800 font-mono-numbers">${apt.fee}</strong></span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-teal-900 bg-teal-50/70 p-2 rounded-lg mt-2">
                    <strong>Consultation Notes:</strong> {apt.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                {apt.status === 'confirmed' && (
                  <>
                    {apt.type === 'video' && (
                      <button
                        onClick={() => onNavigate(`/doctor/consultations?aptId=${apt.id}`)}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Video Room</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>

                      <button
                        onClick={() => onNavigate('/doctor/prescriptions')}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Write Rx</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Cancel appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {apt.status === 'completed' && (
                  <button
                    onClick={() => onNavigate('/doctor/prescriptions')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
                  >
                    View / Re-issue Rx
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
