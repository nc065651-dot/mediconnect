import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import type { NotificationItem } from '../../types.ts';
import { Bell, Check, Calendar, Pill, FileText, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const PatientNotifications: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { showToast } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      showToast('All notifications marked as read');
      await load();
    } catch (err: any) {
      showToast('Failed to mark read', 'error');
    }
  };

  const handleMarkOne = async (id: string, link?: string) => {
    try {
      await api.markNotificationRead(id);
      await load();
      if (link) onNavigate(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Clinical alerts, appointment updates, and prescription issuances</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">You are completely caught up</p>
          <p className="text-xs text-slate-500">No unread healthcare alerts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkOne(n.id, n.link)}
              className={`p-4 transition-colors flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 ${
                !n.read ? 'bg-teal-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'appointment'
                      ? 'bg-blue-100 text-blue-800'
                      : n.type === 'prescription'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {n.type === 'appointment' ? (
                    <Calendar className="w-4 h-4" />
                  ) : n.type === 'prescription' ? (
                    <Pill className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono-numbers mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
