/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Flame, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Reminder } from '../types';

interface ReminderManagerProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  onDeleteReminder: (id: string) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function ReminderManager({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onAddToast
}: ReminderManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<Reminder['type']>('REVISION');

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onAddToast('Please specify a reminder headline', 'warning');
      return;
    }

    onAddReminder({
      title: title.trim(),
      date,
      time: time || undefined,
      type
    });

    setTitle('');
    setShowAddForm(false);
    onAddToast('New smart coach reminder loaded', 'success');
  };

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const finishedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Aspirant Reminder & Milestones Cabinet</h2>
          <p className="text-xs text-gray-500">Program active alerts for deep backlog clearances, reading targets, revision queues, and monthly test deadlines.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Configure Reminder</span>
        </button>
      </div>

      {/* Adding form */}
      {showAddForm && (
        <form onSubmit={handleCreateReminder} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" /> New Reminder / Milestone alert
            </h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase col-span-2">Reminder description / Title</label>
              <input
                type="text"
                placeholder="e.g. Complete April Current affairs revision"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="REVISION">📖 REVISION TARGET</option>
                <option value="MOCK">🏆 MOCK TEST SLOT</option>
                <option value="BACKLOG">⚠ BACKLOG CLEARANCE</option>
                <option value="TARGET">🎯 READING TARGET</option>
                <option value="MILESTONE">🏁 MONTHLY MILESTONE</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Time (Optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-black px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Confirm Reminder
            </button>
          </div>
        </form>
      )}

      {/* Lists of reminders: active vs archived */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Reminders checklist */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <BellRing className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <span>Active Alerts & Milestones ({activeReminders.length})</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Scheduled</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {activeReminders.length === 0 ? (
              <div className="text-center py-16 text-xs text-gray-400">
                🎉 All alerts cleared! Clear administrative focus ahead.
              </div>
            ) : (
              activeReminders.map((rem) => (
                <div 
                  key={rem.id}
                  className="rounded-2xl border border-gray-100 bg-slate-50/20 p-4.5 flex items-start justify-between gap-4 hover:border-gray-200 transition"
                >
                  <div className="flex gap-3 items-start">
                    <button
                      onClick={() => {
                        onToggleReminder(rem.id);
                        onAddToast(`Reminder marked processed!`, 'success');
                      }}
                      className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 bg-white"
                    >
                      {/* Check dot empty */}
                    </button>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug">{rem.title}</h4>
                      
                      <div className="flex flex-wrap items-center gap-2 text-[9px] text-gray-400 font-semibold uppercase">
                        <span className={`px-1.5 py-0.5 rounded ${
                          rem.type === 'REVISION' ? 'bg-purple-50 text-purple-700' :
                          rem.type === 'MOCK' ? 'bg-rose-50 text-rose-700 animate-pulse' :
                          rem.type === 'BACKLOG' ? 'bg-amber-50 text-amber-900 font-bold' :
                          'bg-indigo-50 text-indigo-755 text-indigo-700'
                        }`}>
                          {rem.type}
                        </span>

                        <span>⏱ Date: {rem.date} {rem.time ? `at ${rem.time}` : ''}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onDeleteReminder(rem.id);
                      onAddToast('Reminder removed', 'info');
                    }}
                    className="p-1 rounded text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition"
                    title="Delete alert permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Processed / Dismissed / Archives */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-gray-400" />
                <span>Cleared History Archive ({finishedReminders.length})</span>
              </h3>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {finishedReminders.length === 0 ? (
                <p className="text-center py-10 text-xs text-gray-400 italic">No historical alerts compiled.</p>
              ) : (
                finishedReminders.map((rem) => (
                  <div key={rem.id} className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-gray-450 line-through leading-tight">{rem.title}</p>
                      <span className="text-[8px] text-gray-405 font-bold uppercase tracking-wider">{rem.type}</span>
                    </div>

                    <button 
                      onClick={() => onToggleReminder(rem.id)}
                      className="text-[9px] font-bold text-blue-650 hover:underline text-blue-600"
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100 text-xs text-amber-900 mt-6 md:mt-2 space-y-1">
            <span className="font-extrabold flex items-center gap-1">🏆 WBCS Coach Protip</span>
            <p className="text-[11px] leading-relaxed">
              Ensure you schedule your monthly mock test goals at least 7 days in advance. This permits sufficient space for syllabus completion reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
