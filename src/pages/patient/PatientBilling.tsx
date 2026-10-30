import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { Invoice } from '../../types.ts';
import { CreditCard, Download, CheckCircle2, ShieldCheck, Calendar, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const PatientBilling: React.FC = () => {
  const { showToast } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getInvoices();
        setInvoices(res.invoices);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSpent = invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Billing & Receipts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent consultation invoices, simulated payment history, and downloadable clinical receipts
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Consultations</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{invoices.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Paid (Simulated)</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">${totalSpent}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Insurance Claims</p>
            <p className="text-sm font-bold text-slate-900">Direct Superbill Ready</p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-800">No payment records found</p>
          <p className="text-xs text-slate-500">Invoices for clinic visits and telehealth sessions will populate here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-4">Receipt #</th>
                <th className="p-4">Consultation With</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono-numbers font-bold text-slate-900">{inv.receiptNumber}</td>
                  <td className="p-4 font-semibold text-slate-800">{inv.doctorName}</td>
                  <td className="p-4 font-mono-numbers text-slate-500">{inv.date}</td>
                  <td className="p-4 text-slate-600">{inv.paymentMethod}</td>
                  <td className="p-4 font-mono-numbers font-bold text-slate-900">${inv.amount}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold rounded-lg uppercase">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => showToast(`Receipt ${inv.receiptNumber} downloaded successfully!`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
