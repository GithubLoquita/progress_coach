/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DailyTask, Subject, Chapter, MockTest } from '../types';
import AiPlannerService from './AiPlannerService';

interface DailyPlannerProps {
  tasks: DailyTask[];
  subjects: Subject[];
  chapters: Chapter[];
  mocks: MockTest[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<DailyTask, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onSetStatus: (id: string, status: 'COMPLETED' | 'PENDING' | 'MISSED') => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onApplyGeneratedSchedule?: (newTasks: Omit<DailyTask, 'id'>[]) => void;
}

export default function DailyPlanner({
  tasks,
  subjects,
  chapters,
  mocks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSetStatus,
  onAddToast,
  onApplyGeneratedSchedule
}: DailyPlannerProps) {
  const [activeLayout, setActiveLayout] = useState<'KANBAN' | 'TIMELINE'>('KANBAN');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [recurring, setRecurring] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onAddToast('Please specify a task label', 'warning');
      return;
    }
    
    onAddTask({
      title: title.trim(),
      startTime,
      endTime,
      priority,
      status: 'PENDING',
      subjectId: selectedSubjectId || undefined,
      recurring
    });

    setTitle('');
    setShowAddTaskForm(false);
    onAddToast('Daily study block allocated successfully', 'success');
  };

  // Compute missed tasks count
  const missedTasks = tasks.filter(t => t.status === 'MISSED');
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  // Time comparison helper: convert "HH:MM" to minutes for chronorder
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const sortedTasksByTime = [...tasks].sort((a,b) => getMinutes(a.startTime) - getMinutes(b.startTime));

  return (
    <div className="space-y-6">
      {/* AI Study Plan suggestions section */}
      <AiPlannerService 
        subjects={subjects}
        chapters={chapters}
        mocks={mocks}
        tasks={tasks}
        onAddTask={onAddTask}
        onApplyGeneratedSchedule={onApplyGeneratedSchedule}
        onAddToast={onAddToast}
      />

      {/* Dynamic Header with Metric chips */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active daily study schedule</h2>
          <p className="text-xs text-gray-500">Plan precise time-blocks, tag related subjects, and manage missed backlogs.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout toggles: timeline vs Drag-and-click Columns */}
          <div className="flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveLayout('KANBAN')}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                activeLayout === 'KANBAN' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Interactive Board
            </button>
            <button
              onClick={() => setActiveLayout('TIMELINE')}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                activeLayout === 'TIMELINE' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Daily Timeline
            </button>
          </div>

          <button
            onClick={() => setShowAddTaskForm(!showAddTaskForm)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-full transition"
          >
            <Plus className="h-4 w-4" />
            <span>Allocate Block</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Overview Ribbon */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-150 bg-emerald-50/20 p-4 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider">Completed Blocks</span>
            <span className="block text-xl font-black text-emerald-700">{completedTasks.length} Done</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{completedTasks.length * 20} XP earned</span>
        </div>

        <div className="rounded-2xl border border-amber-150 bg-amber-50/20 p-4 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider">Remaining Schedule</span>
            <span className="block text-xl font-black text-amber-700">{pendingTasks.length} Active</span>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Keep focused</span>
        </div>

        <div className="rounded-2xl border border-rose-150 bg-rose-50/20 p-4 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase text-rose-800 tracking-wider">Missed tasks (Backlogs)</span>
            <span className="block text-xl font-black text-rose-700">{missedTasks.length} Backlogged</span>
          </div>
          {missedTasks.length > 0 ? (
            <button 
              onClick={() => {
                missedTasks.forEach(t => onSetStatus(t.id, 'PENDING'));
                onAddToast('Backlog tasks re-scheduled back into active study queue!', 'info');
              }}
              className="text-[10px] font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl"
            >
              Reschedule All
            </button>
          ) : (
            <span className="text-xs text-rose-600 font-bold bg-white px-2 py-1 rounded-full">Perfect clean</span>
          )}
        </div>
      </div>

      {/* Task Creation Form Draw (Collapsible) */}
      {showAddTaskForm && (
        <form onSubmit={handleCreateTask} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" /> Specify preparation target block
            </h4>
            <button type="button" onClick={() => setShowAddTaskForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Activity / Study Subject topic</label>
              <input
                type="text"
                placeholder="e.g. Read Indian History: Partition of Bengal notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Related Subject Tag</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- No specific subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Priority Rating</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HIGH">🔴 High (MANDATORY)</option>
                <option value="MEDIUM">🟡 Medium (STANDARD)</option>
                <option value="LOW">🔵 Low (REVISION/MINIMAL)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6 pl-2">
              <input
                type="checkbox"
                id="recurringCheck"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="recurringCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Schedule as Daily Routine
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddTaskForm(false)}
              className="text-xs font-bold px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-black px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Confirm Allocations
            </button>
          </div>
        </form>
      )}

      {/* Main layouts switcher */}
      {activeLayout === 'KANBAN' ? (
        /* Status Board with Action columns (Emulating interactive drag-& click) */
        <div className="grid gap-6 md:grid-cols-3">
          {/* COLUMN: PENDING STUDY BLOCKS */}
          <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-700 tracking-wide uppercase flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span>Active study targets ({pendingTasks.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">Planned</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 italic">
                  No active pending tasks. Excellent.
                </div>
              ) : (
                pendingTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs hover:shadow-sm hover:border-blue-250 transition-all space-y-3.5 relative group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {task.priority} Priority
                        </span>
                        
                        <button 
                          onClick={() => {
                            onDeleteTask(task.id);
                            onAddToast('Study block deleted', 'info');
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-opacity p-0.5 rounded"
                          title="Delete study target"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h5 className="text-xs font-bold text-gray-800 leading-snug">{task.title}</h5>
                      <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 inline" /> {task.startTime} — {task.endTime}
                      </p>
                    </div>

                    {/* Drag simulator: Quick shift Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px]">
                      <button 
                        onClick={() => {
                          onSetStatus(task.id, 'MISSED');
                          onAddToast('Moved to Backlogs', 'warning');
                        }}
                        className="text-rose-600 hover:underline font-bold"
                      >
                        🔴 Mark Missed
                      </button>

                      <button 
                        onClick={() => {
                          onSetStatus(task.id, 'COMPLETED');
                          onAddToast('Target unit achieved! +20XP', 'success');
                        }}
                        className="text-emerald-700 font-extrabold flex items-center gap-1 hover:underline"
                      >
                        Complete <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN: COMPLETED TODAY */}
          <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h4 className="text-xs font-black text-emerald-800 tracking-wide uppercase flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Finished blocks ({completedTasks.length})</span>
              </h4>
              <span className="text-[10px] text-emerald-600 font-bold">Achieved</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {completedTasks.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 italic">
                  Progress bar empty. Turn tasks to complete!
                </div>
              ) : (
                completedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 transition-all relative"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                        
                        <button 
                          onClick={() => {
                            onSetStatus(task.id, 'PENDING');
                            onAddToast('Task moved back to scheduled', 'info');
                          }}
                          className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                        >
                          Undo
                        </button>
                      </div>
                      <h5 className="text-xs font-bold text-gray-500 line-through leading-snug">{task.title}</h5>
                      <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 inline animate-pulse" /> Spent time-block: {task.startTime} — {task.endTime}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN: BACKLOGS & MISSED */}
          <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2">
              <h4 className="text-xs font-black text-rose-800 tracking-wide uppercase flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>Missed & backlogs ({missedTasks.length})</span>
              </h4>
              <span className="text-[10px] text-rose-500 font-bold">Action Needed</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {missedTasks.length === 0 ? (
                <div className="text-center py-12 text-xs text-emerald-700 font-bold bg-emerald-50/20 rounded-2xl border border-emerald-100">
                  🎉 Fantastic! Zero backlogs left.
                </div>
              ) : (
                missedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="rounded-2xl border border-rose-100 bg-rose-50/20 p-4 transition-all space-y-3.5 relative"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between animate-bounce">
                        <span className="text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-0.5">
                          ⚠ BACKLOG
                        </span>
                        
                        <button 
                          onClick={() => {
                            onDeleteTask(task.id);
                            onAddToast('Dismissed backlog item', 'info');
                          }}
                          className="text-gray-400 hover:text-rose-500 p-0.5 rounded"
                          title="Dismiss item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h5 className="text-xs font-bold text-rose-950 leading-snug">{task.title}</h5>
                      <span className="text-[9px] text-rose-500 font-bold">Planned slot slot: {task.startTime} — {task.endTime}</span>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-rose-150">
                      <button 
                        onClick={() => {
                          onSetStatus(task.id, 'PENDING');
                          onAddToast('Rescheduled back', 'success');
                        }}
                        className="text-[10px] font-black text-blue-700 hover:underline"
                      >
                        🔄 Re-attempt today
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* TIMELINE DISPLAY SCHEDULER */
        <div className="rounded-3xl bg-white border border-gray-100 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-blue-600" /> Chronological Study Timeline
            </h4>
            <span className="text-xs text-gray-400 font-medium">Auto-sorted by start times</span>
          </div>

          <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-8">
            {sortedTasksByTime.map((task) => {
              const isDone = task.status === 'COMPLETED';
              const isMissed = task.status === 'MISSED';
              return (
                <div key={task.id} className="relative group">
                  {/* Timeline Node Ring */}
                  <div className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
                    isDone ? 'border-emerald-500 bg-emerald-50' : 
                    isMissed ? 'border-rose-500 bg-rose-50' : 'border-blue-550'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      isDone ? 'bg-emerald-500 animate-ping' : 
                      isMissed ? 'bg-rose-500' : 'bg-blue-600'
                    }`} />
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 max-w-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-500">
                        {task.startTime} — {task.endTime}
                      </p>
                      
                      <div className="flex gap-1.5 items-center">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' :
                          task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {task.priority} Priority
                        </span>
                        {task.recurring && (
                          <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded" title="Recurring routine">
                            Routine
                          </span>
                        )}
                      </div>
                    </div>

                    <h5 className={`text-xs font-bold ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h5>

                    {/* Timeline Interaction */}
                    <div className="flex gap-4 pt-2 border-t border-slate-200 mt-1 text-[10px]">
                      <button
                        onClick={() => onSetStatus(task.id, isDone ? 'PENDING' : 'COMPLETED')}
                        className={`font-bold hover:underline ${isDone ? 'text-gray-500' : 'text-emerald-700 font-extrabold'}`}
                      >
                        {isDone ? '↩ Undo Complete' : '✅ Mark finished'}
                      </button>

                      {!isDone && !isMissed && (
                        <button
                          onClick={() => onSetStatus(task.id, 'MISSED')}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          🔴 Fail Target
                        </button>
                      )}

                      {isMissed && (
                        <button
                          onClick={() => onSetStatus(task.id, 'PENDING')}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          🔄 Re-schedule block
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
