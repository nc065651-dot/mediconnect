import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Appointment, Prescription, MedicalRecord, LabReport } from '../../types.ts';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Pill,
  FolderHeart,
  CalendarPlus,
  ArrowRight,
  ShieldAlert,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Heart,
  Droplet,
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [aptRes, rxRes, recRes, labRes] = await Promise.all([
          api.getAppointments(),
          api.getPrescriptions(),
          api.getRecords(),
          api.getLabReports(),
        ]);
        setAppointments(aptRes.appointments);
        setPrescriptions(rxRes.prescriptions);
        setRecords(recRes.records);
        setLabReports(labRes.labReports);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingAppointments = appointments.filter((a) => a.status === 'confirmed');
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Health Record Vault Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your centralized clinical profile is synchronized. You have {upcomingAppointments.length} upcoming consultation{upcomingAppointments.length === 1 ? '' : 's'} scheduled this week.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/patient/book-appointment')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Doctor</span>
          </button>
          <button
            onClick={() => onNavigate('/patient/records')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-2"
          >
            <FolderHeart className="w-4 h-4" />
            <span>Upload Record</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Visits</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{appointments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">e-Prescriptions</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{prescriptions.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">DRiefcase Files</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{records.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Blood Group</p>
            <p className="text-xl font-bold text-slate-900">O+ Positive</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Next Appointment & Clinical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Scheduled Appointment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                <h2 className="text-base font-bold text-slate-900">Upcoming Consultation</h2>
              </div>
              <button
                onClick={() => onNavigate('/patient/appointments')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>All Appointments ({appointments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextAppointment ? (
              <div className="p-5 bg-teal-50/50 border border-teal-200/80 rounded-2xl space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <img
                        src={nextAppointment.doctorAvatar || '/src/assets/images/doctor_sarah_chen_1793264706983.jpg'}
                        alt={nextAppointment.doctorName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-teal-800 font-semibold tracking-wide uppercase">
                        {nextAppointment.doctorSpecialty}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{nextAppointment.doctorName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{nextAppointment.reason}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-700 text-white uppercase tracking-wider">
                    {nextAppointment.type === 'video' ? 'Video Visit' : 'Clinic Visit'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-teal-200/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-teal-700" />
                    <span className="font-medium font-mono-numbers">{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-teal-700" />
                    <span className="font-medium font-mono-numbers">{nextAppointment.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500">
                    <span>Fee: </span>
                    <strong className="text-slate-900 font-mono-numbers">${nextAppointment.fee} (Paid)</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {nextAppointment.type === 'video' ? (
                      <button
                        onClick={() => onNavigate(`/patient/consultations?aptId=${nextAppointment.id}`)}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('/patient/appointments')}
                        className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                      >
                        View Clinic Pass
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                <p>No pending consultations scheduled.</p>
                <button
                  onClick={() => onNavigate('/patient/book-appointment')}
                  className="mt-3 text-teal-700 font-semibold hover:underline"
                >
                  Schedule a doctor consultation now →
                </button>
              </div>
            )}
          </div>

          {/* Recent e-Prescriptions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Pill className="w-5 h-5 text-teal-700" />
                <h2>Recent e-Prescriptions</h2>
              </div>
              <button
                onClick={() => onNavigate('/patient/prescriptions')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View All ({prescriptions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {prescriptions.slice(0, 2).map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rx.diagnosis}</span>
                      <span className="text-[10px] text-teal-800 bg-teal-100/70 font-semibold px-2 py-0.5 rounded">
                        Signed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Prescribed by {rx.doctorName} · {rx.date}
                    </p>
                    <div className="text-xs text-slate-600 truncate">
                      {rx.medications.map((m) => `${m.name} (${m.dosage})`).join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRx(rx)}
                    className="px-3 py-2 text-xs font-semibold text-teal-800 bg-white border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: DRiefcase Records & Health Profile Snippet */}
        <div className="lg:col-span-5 space-y-6">
          {/* Health Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Health Profile</h2>
              <button
                onClick={() => onNavigate('/patient/profile')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Edit Profile
              </button>
            </div>

            {/* Profile completion progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Clinical Profile Completion</span>
                <span className="font-bold text-teal-800 font-mono-numbers">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full w-[85%]" />
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Known Allergies</span>
                <span className="font-semibold text-rose-700">Penicillin, Shellfish</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Chronic Conditions</span>
                <span className="font-medium text-slate-800">Stage 1 Hypertension</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Emergency Contact</span>
                <span className="font-medium text-slate-800">Claire Morgan (Spouse)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Insurance Provider</span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">BlueCross Premier</span>
              </div>
            </div>
          </div>

          {/* DRiefcase Health Locker Snippet */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FolderHeart className="w-5 h-5 text-teal-700" />
                <h2>DRiefcase Records</h2>
              </div>
              <button
                onClick={() => onNavigate('/patient/records')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View Locker ({records.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {records.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onNavigate('/patient/records')}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-teal-500/50 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">{rec.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {rec.category.replace('_', ' ')} · {rec.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 bg-slate-100 rounded text-slate-600 shrink-0">
                    {rec.fileType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Inspection Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Official Electronic Prescription
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedRx.clinicName}</h3>
                <p className="text-xs text-slate-500">{selectedRx.doctorName} · {selectedRx.doctorCredentials}</p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block">Patient Name</span>
                <span className="font-bold text-slate-800">{selectedRx.patientName} (Age: {selectedRx.patientAge})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Issue Date</span>
                <span className="font-bold text-slate-800 font-mono-numbers">{selectedRx.date}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Clinical Diagnosis</span>
                <span className="font-semibold text-teal-900">{selectedRx.diagnosis}</span>
              </div>
            </div>

            {/* Medications Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Prescribed Regimen</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="p-3">Medication</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRx.medications.map((m) => (
                      <tr key={m.id}>
                        <td className="p-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="p-3 font-mono-numbers">{m.dosage}</td>
                        <td className="p-3">{m.frequency}</td>
                        <td className="p-3">{m.duration}</td>
                        <td className="p-3 text-slate-500">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedRx.clinicalNotes && (
              <div className="text-xs bg-teal-50/60 p-4 rounded-xl text-teal-950">
                <strong className="block mb-1">Doctor Advice:</strong>
                <p>{selectedRx.clinicalNotes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Digitally verified under Clinical Telehealth Standards.</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
