import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { Invoice, DoctorProfile } from '../../types.ts';
import { DollarSign, Star, TrendingUp, Receipt, ShieldCheck } from 'lucide-react';

export const DoctorEarnings: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [invRes, docRes] = await Promise.all([
          api.getInvoices(),
          api.getDoctorProfile(),
        ]);
        setInvoices(invRes.invoices);
        setDoctor(docRes.doctor);
      } catch (err) {
        console.error('Failed to load doctor earnings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalEarnings = invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0);

  const reviews = [
    {
      patient: 'Alex M.',
      rating: 5,
      date: 'Oct 2026',
      comment: 'Dr. Sarah Chen was extremely thorough reviewing my blood pressure logs. The e-prescription was ready in my portal instantly.',
    },
    {
      patient: 'Maya P.',
      rating: 5,
      date: 'Sep 2026',
      comment: 'Clear explanations and punctual virtual appointment. Excellent communication via the messaging desk.',
    },
    {
      patient: 'Robert D.',
      rating: 4.8,
      date: 'Aug 2026',
      comment: 'Very professional cardiologist. Appreciated the low-sodium dietary advice alongside the medication.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Earnings & Reviews</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consultation revenue analytics, patient reviews, and verified rating breakdown
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue (Simulated)</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">${totalEarnings}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Overall Rating</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">
              {doctor?.rating || 4.9} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Paid Consultations</p>
            <p className="text-2xl font-bold text-slate-900 font-mono-numbers">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* Patient Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Verified Patient Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{rev.patient}</span>
                <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono-numbers">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
              <span className="text-[10px] text-slate-400 block pt-1">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
