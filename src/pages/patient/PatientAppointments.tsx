import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Appointment } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  Building,
  RotateCcw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  CalendarPlus,
} from 'lucide-react';

interface PatientAppointmentsProps {
  onNavigate: (path: string) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ onNavigate }) => {
  const { showToast } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Modals
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('11:00 AM');

  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

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

  const handleCancelSubmit = async () => {
    if (!cancelApt) return;
    setActionLoading(true);
    try {
      await api.cancelAppointment(cancelApt.id, cancelReason || 'Cancelled by patient request');
      showToast('Appointment cancelled successfully');
      setCancelApt(null);
      setCancelReason('');
      await loadAppointments();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleApt || !rescheduleDate || !rescheduleSlot) {
      showToast('Please specify a new date and time slot', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await api.rescheduleAppointment(rescheduleApt.id, {
        newDate: rescheduleDate,
        newTimeSlot: rescheduleSlot,
      });
      showToast('Appointment rescheduled successfully');
      setRescheduleApt(null);
      await loadAppointments();
    } catch (err: any) {
      showToast(err.message || 'Slot conflict: doctor already booked', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (tab === 'upcoming') return a.status === 'confirmed' || a.status === 'pending';
    if (tab === 'completed') return a.status === 'completed';
    if (tab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your clinic consultations, telehealth sessions, and visit history
          </p>
        </div>

        <button
          onClick={() => onNavigate('/patient/book-appointment')}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl max-w-md text-xs font-semibold">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({appointments.filter((a) => a.status === 'completed').length})
        </button>
        <button
          onClick={() => setTab('cancelled')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'cancelled' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancelled ({appointments.filter((a) => a.status === 'cancelled').length})
        </button>
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-800">No {tab} appointments found</p>
          <p className="text-xs text-slate-500">
            {tab === 'upcoming'
              ? 'You do not have any pending consultations scheduled.'
              : `Your ${tab} visit history will appear here.`}
          </p>
          {tab === 'upcoming' && (
            <button
              onClick={() => onNavigate('/patient/book-appointment')}
              className="mt-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={apt.doctorAvatar || '/src/assets/images/doctor_sarah_chen_1793264706983.jpg'}
                    alt={apt.doctorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 uppercase">
                      {apt.doctorSpecialty}
                    </span>
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
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                  <p className="text-xs text-slate-500">{apt.reason}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span className="font-mono-numbers">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      <span className="font-mono-numbers">{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {apt.type === 'video' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-teal-700" />
                          <span>Telehealth Video</span>
                        </>
                      ) : (
                        <>
                          <Building className="w-3.5 h-3.5 text-teal-700" />
                          <span>Clinic Visit</span>
                        </>
                      )}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-teal-900 bg-teal-50/70 p-2 rounded-lg mt-2">
                      <strong>Doctor Summary:</strong> {apt.notes}
                    </p>
                  )}

                  {apt.cancellationReason && (
                    <p className="text-xs text-rose-800 bg-rose-50/70 p-2 rounded-lg mt-2">
                      <strong>Cancellation Reason:</strong> {apt.cancellationReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-xs text-slate-500 block mb-1">
                  Fee: <strong className="text-slate-900 font-mono-numbers">${apt.fee}</strong>
                </span>

                {apt.status === 'confirmed' && (
                  <>
                    {apt.type === 'video' && (
                      <button
                        onClick={() => onNavigate(`/patient/consultations?aptId=${apt.id}`)}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRescheduleApt(apt);
                          setRescheduleDate(apt.date);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => setCancelApt(apt)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                )}

                {apt.status === 'completed' && (
                  <button
                    onClick={() => onNavigate('/patient/prescriptions')}
                    className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View e-Rx & Notes</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reschedule Consultation</h3>
            <p className="text-xs text-slate-500">
              Select a new date and time slot with {rescheduleApt.doctorName}:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 font-mono-numbers"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Dismiss
              </button>
              <button
                disabled={actionLoading}
                onClick={handleRescheduleSubmit}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl shadow-sm"
              >
                {actionLoading ? 'Updating...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cancel Appointment</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel your consultation with {cancelApt.doctorName} on {cancelApt.date}?
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for cancellation
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Schedule conflict, feeling better, traveling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setCancelApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep Appointment
              </button>
              <button
                disabled={actionLoading}
                onClick={handleCancelSubmit}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-sm"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
