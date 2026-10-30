import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { Prescription } from '../../types.ts';
import { Pill, Calendar, User, Download, Stethoscope, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPrescriptions();
        setPrescriptions(res.prescriptions);
      } catch (err) {
        console.error('Failed to load prescriptions:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Prescriptions (e-Rx)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Doctor-signed digital prescriptions with dosage regimens and meal timings
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Pill className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No active electronic prescriptions</p>
          <p className="text-xs text-slate-500">
            Consult a physician through MediConnect to receive digital prescription regimens.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{rx.diagnosis}</h3>
                    <p className="text-xs text-slate-500">
                      Prescribed by <strong className="text-slate-800">{rx.doctorName}</strong> ({rx.doctorSpecialty})
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {rx.medications.map((m) => (
                    <span
                      key={m.id}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 font-medium text-xs rounded-lg"
                    >
                      {m.name} · {m.dosage} ({m.frequency})
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>Issued: <strong className="text-slate-700 font-mono-numbers">{rx.date}</strong></span>
                  </div>
                  {rx.followUpDate && (
                    <div className="flex items-center gap-1.5">
                      <span>Follow-up: <strong className="text-teal-800 font-mono-numbers">{rx.followUpDate}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedRx(rx)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full e-Rx</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <span className="font-bold text-slate-800">{selectedRx.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Issue Date</span>
                <span className="font-bold text-slate-800 font-mono-numbers">{selectedRx.date}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Clinical Assessment / Diagnosis</span>
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
                      <th className="p-3">Timing & Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRx.medications.map((m) => (
                      <tr key={m.id}>
                        <td className="p-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="p-3 font-mono-numbers">{m.dosage}</td>
                        <td className="p-3">{m.frequency}</td>
                        <td className="p-3">{m.duration}</td>
                        <td className="p-3 text-slate-500">{m.timing} — {m.instructions}</td>
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
              <span className="text-slate-400">Digitally signed under Clinical Telehealth Standards.</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
