import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { LabReport } from '../../types.ts';
import { FileSpreadsheet, Calendar, Building, CheckCircle2, AlertTriangle, Download, ArrowRight, Eye } from 'lucide-react';

export const PatientLabReports: React.FC = () => {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getLabReports();
        setReports(res.labReports);
      } catch (err) {
        console.error('Failed to load lab reports:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Diagnostic Lab Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Laboratory blood panels, metabolic markers, and diagnostic test analytics
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No laboratory test panels on file</p>
          <p className="text-xs text-slate-500">
            Pathology and diagnostic results ordered by your doctor will synchronize here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                      {rep.testCategory}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{rep.testName}</h2>
                    <p className="text-xs text-slate-500">
                      Collected: <span className="font-mono-numbers">{rep.sampleCollectedDate}</span> · Reported: <span className="font-mono-numbers">{rep.reportDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl">
                    {rep.status}
                  </span>
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Detail</span>
                  </button>
                </div>
              </div>

              {/* Interpretation Note */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 text-xs text-teal-950">
                <strong className="block mb-1 font-semibold">Laboratory Clinical Interpretation:</strong>
                <p>{rep.overallInterpretation}</p>
              </div>

              {/* Table of Test Results */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Test Parameter</th>
                      <th className="p-3">Result Value</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Standard Reference Interval</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rep.results.map((res, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{res.name}</td>
                        <td className="p-3 font-bold font-mono-numbers text-slate-800">{res.value}</td>
                        <td className="p-3 text-slate-500">{res.unit}</td>
                        <td className="p-3 font-mono-numbers text-slate-500">{res.referenceRange}</td>
                        <td className="p-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                              res.status === 'normal'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Facility: <strong className="text-slate-800">{rep.laboratoryName}</strong></span>
                <span>Ordering Clinician: <strong className="text-slate-800">{rep.referringDoctor}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
