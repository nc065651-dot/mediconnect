import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { MessageItem } from '../../types.ts';
import { MessageSquare, Send, User, CheckCheck, Clock } from 'lucide-react';

export const PatientMessages: React.FC = () => {
  const { user, showToast } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('user_doc_01');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      const res = await api.getConversations();
      setConversations(res.conversations);
      if (res.conversations.length > 0 && !selectedPartnerId) {
        setSelectedPartnerId(res.conversations[0].partnerId);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (partnerId: string) => {
    try {
      const res = await api.getMessageThread(partnerId);
      setMessages(res.messages);
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedPartnerId) {
      loadThread(selectedPartnerId);
    }
  }, [selectedPartnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !selectedPartnerId) return;

    try {
      const res = await api.sendMessage(selectedPartnerId, newText);
      setMessages([...messages, res.message]);
      setNewText('');
      loadConversations();
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Messaging</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Communicate directly with your assigned physicians and care teams
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left: Conversations list */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Physician Threads</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations yet
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partnerId}
                  onClick={() => setSelectedPartnerId(c.partnerId)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                    selectedPartnerId === c.partnerId ? 'bg-teal-50/70 border-l-2 border-teal-600' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img
                      src={c.partnerAvatar || '/src/assets/images/doctor_sarah_chen_1793264706983.jpg'}
                      alt={c.partnerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{c.partnerName}</h3>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-medium">{c.specialty || 'Physician'}</p>
                    <p className="text-xs text-slate-500 truncate mt-1">{c.lastMessage.content}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Message history & input */}
        <div className="md:col-span-8 flex flex-col justify-between h-[560px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  {conversations.find((c) => c.partnerId === selectedPartnerId)?.partnerName || 'Dr. Sarah Chen, MD'}
                </h3>
                <span className="text-[10px] text-slate-400">Cardiology Specialist · Active Channel</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1">
                    {m.senderName} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[75%] leading-relaxed ${
                      isMe
                        ? 'bg-teal-700 text-white rounded-tr-sm shadow-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-3 bg-white">
            <input
              type="text"
              placeholder="Write a message to your doctor..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
