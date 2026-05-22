/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Activity, 
  Sparkles, 
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';
import { RevisionItem, Subject } from '../types';

interface RevisionSystemProps {
  revisions: RevisionItem[];
  subjects: Subject[];
  onCompleteRevision: (id: string, nextInterval?: 1 | 7 | 21) => void;
  onAddRevision: (item: Omit<RevisionItem, 'id' | 'status'>) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function RevisionSystem({
  revisions,
  subjects,
  onCompleteRevision,
  onAddRevision,
  onAddToast
}: RevisionSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [interval, setInterval] = useState<1 | 7 | 21>(1);

  // Filter lists
  const today = new Date().toISOString().split('T')[0];
  const pendingQueue = revisions.filter(r => r.status === 'PENDING' && r.dueDate <= today);
  const upcomingQueue = revisions.filter(r => r.status === 'PENDING' && r.dueDate > today);
  const completedHistory = revisions.filter(r => r.status === 'DONE');

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onAddToast('Please specify what concept or topic needs revision', 'warning');
      return;
    }

    const calculatedDueDate = new Date();
    calculatedDueDate.setDate(calculatedDueDate.getDate() + interval);
    
    onAddRevision({
      title: title.trim(),
      subjectId: selectedSubId,
      intervalDays: interval,
      dueDate: calculatedDueDate.toISOString().split('T')[0],
      lastRevised: new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setShowAddForm(false);
    onAddToast(`Spaced Repetition ticket created. Due in ${interval} Days!`, 'success');
  };

  const handleMarkRevisionDone = (item: RevisionItem) => {
    // If interval was 1 day, next milestone is 7 days.
    // If interval was 7 days, next milestone is 21 days.
    // If interval was 21 days, fully consolidated!
    let nextInt: 1 | 7 | 21 | undefined;
    let toastMessage = '';

    if (item.intervalDays === 1) {
      nextInt = 7;
      toastMessage = 'Milestone 1 (1-Day recall) achieved! Scheduled 7-Day spaced reminder.';
    } else if (item.intervalDays === 7) {
      nextInt = 21;
      toastMessage = 'Milestone 2 (7-Day retention) achieved! Scheduled final 21-Day reminder.';
    } else {
      nextInt = undefined; // fully completed!
      toastMessage = 'Superb! Milestone 3 (21-Day recall) achieved. Topic committed to long-term memory!';
    }

    onCompleteRevision(item.id, nextInt);
    onAddToast(toastMessage, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Spaced Repetition engine</h2>
          <p className="text-xs text-gray-500">
            Scientifically scheduled recall loops (1-Day, 7-Day, 21-Day) to retain complex policies, histories & facts.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Launch Spaced Rep Target</span>
        </button>
      </div>

      {/* Alerts Ribbon section (if revisions backlog is due) */}
      {pendingQueue.length > 2 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">Knowledge decay warning active</p>
              <p className="text-[11px] text-rose-700">You have {pendingQueue.length} revisions overdue. Recall them now to defeat the forgetting curve!</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const first = pendingQueue[0];
              if (first) {
                const sub = subjects.find(s => s.id === first.subjectId);
                onAddToast(`Focusing: ${first.title} (${sub?.title})`, 'info');
              }
            }}
            className="text-xs font-bold text-rose-800 bg-white hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl shrink-0"
          >
            Emergency Review
          </button>
        </div>
      )}

      {/* Add revision form */}
      {showAddForm && (
        <form onSubmit={handleCreateRevision} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" /> Start a new spaced recall milestone
            </h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase col-span-2">Concept Topic to study (e.g. Cripps Mission proposals)</label>
              <input
                type="text"
                placeholder="Indus Valley Town planning, Writs Article list etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Related Subject</label>
              <select
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Spaced repetition Cycle Period</label>
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setInterval(1)}
                className={`p-3 rounded-2xl border text-left flex justify-between items-center ${
                  interval === 1 ? 'border-blue-500 bg-blue-50/50 text-blue-800' : 'border-gray-250 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="block text-xs font-bold">1-Day loop</span>
                  <span className="text-[10px] text-gray-400">Recall tomorrow morning</span>
                </div>
                <Activity className="h-4 w-4 text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => setInterval(7)}
                className={`p-3 rounded-2xl border text-left flex justify-between items-center ${
                  interval === 7 ? 'border-blue-500 bg-blue-50/50 text-blue-800' : 'border-gray-250 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="block text-xs font-bold">7-Day loop</span>
                  <span className="text-[10px] text-gray-400">Weekly consolidate cycle</span>
                </div>
                <Layers className="h-4 w-4 text-emerald-500" />
              </button>

              <button
                type="button"
                onClick={() => setInterval(21)}
                className={`p-3 rounded-2xl border text-left flex justify-between items-center ${
                  interval === 21 ? 'border-blue-500 bg-blue-50/50 text-blue-800' : 'border-gray-250 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="block text-xs font-bold">21-Day loop</span>
                  <span className="text-[10px] text-gray-400">Deep permanent schema</span>
                </div>
                <Award className="h-4 w-4 text-purple-500" />
              </button>
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
              Start Spaced Loop
            </button>
          </div>
        </form>
      )}

      {/* Grid of Pending (Due) vs Upcoming loop */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* DUE FOR RECALL TODAY */}
        <div className="md:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-150 pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin-slow" />
              <h3 className="font-bold text-gray-900">Due for Revision Today ({pendingQueue.length})</h3>
            </div>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Forgets trigger</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {pendingQueue.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <p className="text-sm font-bold text-emerald-800">🎉 Great Job! Your revision queue is blank.</p>
                <p className="text-xs text-gray-500">Every scheduled recall has been achieved. Long term memory looks clean.</p>
              </div>
            ) : (
              pendingQueue.map((item) => {
                const sub = subjects.find(s => s.id === item.subjectId);
                return (
                  <div 
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-slate-50/30 p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-blue-200 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          item.intervalDays === 1 ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          item.intervalDays === 7 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}>
                          Milestone: {item.intervalDays}-Day Recall
                        </span>
                        
                        <span className="text-[10px] text-gray-400 font-medium">Sub: {sub ? sub.title : 'General'}</span>
                      </div>

                      <h4 className="text-xs font-extrabold text-gray-800 leading-normal">{item.title}</h4>
                      {item.lastRevised && (
                        <p className="text-[9px] text-gray-400">Previous session: {item.lastRevised}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleMarkRevisionDone(item)}
                      className="rounded-xl bg-blue-600 text-white font-extrabold text-xs px-4 py-2 hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mark Recall Completed</span>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* UPCOMING REVISIONS MAP */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-155 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-gray-400" />
              <span>Upcoming Scheduled Revisions ({upcomingQueue.length})</span>
            </h3>
          </div>

          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
            {upcomingQueue.length === 0 ? (
              <p className="text-center py-10 text-xs text-gray-400 italic">No revisions scheduled for future days.</p>
            ) : (
              upcomingQueue.map((item) => {
                const sub = subjects.find(s => s.id === item.subjectId);
                return (
                  <div key={item.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-indigo-700 font-bold uppercase">{sub ? sub.title.substring(0, 18) : ''}..</span>
                      <span className="text-[9px] font-bold text-gray-650 bg-gray-100 px-1.5 py-0.5 rounded">T+{item.intervalDays}D</span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 leading-tight">{item.title}</p>
                    <p className="text-[9px] font-semibold text-gray-400">Next Scheduled recall: {item.dueDate}</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
