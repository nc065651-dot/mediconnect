import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { AuditLogItem, DoctorProfile } from '../../types.ts';
import { ShieldCheck, Users, Calendar, DollarSign, RotateCcw, CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const loadAdminData = async () => {
    try {
      const [statsRes, docRes, logsRes] = await Promise.all([
        api.getAdminStats(),
        api.getDoctors(),
        api.getAuditLogs(),
      ]);
      setStats(statsRes.stats);
      setDoctors(docRes.doctors);
      setAuditLogs(logsRes.auditLogs);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleDoctorVerify = async (doctorId: string) => {
    try {
      const res = await api.toggleDoctorVerification(doctorId);
      showToast(`Doctor verification updated: ${res.isVerified ? 'Verified' : 'Unverified'}`);
      await loadAdminData();
    } catch (err: any) {
      showToast('Failed to toggle verification', 'error');
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('Reset demonstration database to initial pristine dataset?')) return;
    setResetting(true);
    try {
      await api.resetDemoData();
      showToast('Demo data restored to initial demonstration state');
      await loadAdminData();
    } catch (err: any) {
      showToast('Failed to reset demo dataset', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Hospital Administration & Compliance Audit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Supervisory Control Desk</h1>
          <p className="text-xs text-slate-400">
            Monitor hospital throughput, doctor credential verification, and HIPAA audit trail logs
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          disabled={resetting}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetting ? 'Resetting...' : 'Reset Demo Dataset'}</span>
        </button>
      </div>

      {/* Platform KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Accounts</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{stats.totalUsers}</p>
            <span className="text-[10px] text-slate-500">{stats.totalPatients} Patients · {stats.totalDoctors} Clinicians</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Appointments</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{stats.totalAppointments}</p>
            <span className="text-[10px] text-emerald-700 font-medium">{stats.completedConsultations} Completed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">e-Prescriptions</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{stats.totalPrescriptions}</p>
            <span className="text-[10px] text-purple-700 font-medium">Signed electronically</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">${stats.totalRevenue}</p>
            <span className="text-[10px] text-teal-700 font-medium">Simulated Transactions</span>
          </div>
        </div>
      )}

      {/* Doctor Approvals & Verification Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Physician Credential Verification</h2>
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Consultation Fee</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{doc.fullName}</td>
                  <td className="p-3 text-slate-600">{doc.specialty}</td>
                  <td className="p-3 font-mono-numbers">{doc.experienceYears} yrs</td>
                  <td className="p-3 font-mono-numbers font-bold text-slate-900">${doc.consultationFee}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        doc.isVerified
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {doc.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleDoctorVerify(doc.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Real-Time Security & Clinical Audit Trail</h2>
          <span className="text-xs text-slate-400 font-mono-numbers">Latest 50 Events</span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50/70">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-800 font-medium">{log.details}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Actor: {log.actorName} ({log.actorRole}) · IP: {log.ipAddress}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-numbers shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
