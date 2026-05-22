/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Compass, 
  AlertCircle, 
  Flame, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Layers,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Subject, Chapter, DailyTask, RevisionItem, MockTest, Reminder } from '../types';
import { MOTIVATIONAL_QUOTES } from '../mockData';
import PomodoroWidget from './PomodoroWidget';

interface DashboardProps {
  subjects: Subject[];
  chapters: Chapter[];
  tasks: DailyTask[];
  revisions: RevisionItem[];
  mocks: MockTest[];
  reminders: Reminder[];
  streak: number;
  onNavigateToTab: (tabId: string) => void;
  onToggleTask: (taskId: string) => void;
  onQuickLogHours: (hours: number) => void;
  onQuickClearReminders: () => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function Dashboard({
  subjects,
  chapters,
  tasks,
  revisions,
  mocks,
  reminders,
  streak,
  onNavigateToTab,
  onToggleTask,
  onQuickLogHours,
  onQuickClearReminders,
  onAddToast
}: DashboardProps) {
  const [logHoursVal, setLogHoursVal] = useState<number>(2);
  const [randomQuote] = useState(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  });

  // Calculations
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(c => c.status === 'COMPLETED').length;
  const inProgressChapters = chapters.filter(c => c.status === 'IN_PROGRESS').length;
  const completionPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Revisions due
  const revisionsDueToday = revisions.filter(r => r.status === 'PENDING').length;

  // Daily Tasks Info
  const activeTasks = tasks.filter(t => t.status !== 'MISSED');
  const completedTasks = activeTasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = activeTasks.filter(t => t.status === 'PENDING').length;
  const missedTasks = tasks.filter(t => t.status === 'MISSED').length;
  const todayTaskRate = activeTasks.length > 0 ? Math.round((completedTasks / activeTasks.length) * 100) : 0;

  // Mock results - average score & trend
  const sortedMocks = [...mocks].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestMock = sortedMocks[sortedMocks.length - 1];
  const secondLatestMock = sortedMocks[sortedMocks.length - 2];
  const mockTrendUp = latestMock && secondLatestMock ? latestMock.score >= secondLatestMock.score : true;

  // Reminders / Milestones due
  const activeReminders = reminders.filter(r => !r.isCompleted);

  // SVG Progress Ring Parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Banner / Welcome Segment */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white md:flex-row md:items-center shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              COACH WARNING ACTIVE
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">WBCS Aspirant Hub</h2>
          <p className="text-sm text-blue-100 max-w-sm">
            Focus today on History revision and GS descriptive composition. You're outperforming 85% of peers this week!
          </p>
        </div>
        
        {/* Quick Study Hours Logger */}
        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
          <p className="text-xs font-semibold text-blue-50">Log Today's Self Study</p>
          <div className="mt-2 flex items-center gap-3">
            <input 
              type="number"
              min="1"
              max="16"
              value={logHoursVal}
              onChange={(e) => setLogHoursVal(Number(e.target.value))}
              className="w-16 rounded-xl border border-white/20 bg-white/15 px-2.5 py-1 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-white/50"
            />
            <button 
              onClick={() => {
                onQuickLogHours(logHoursVal);
                setLogHoursVal(2);
              }}
              className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Add Hours
            </button>
          </div>
          <p className="mt-1 text-[10px] text-blue-200">Recommended target: 6-8 hrs daily</p>
        </div>
      </div>

      {/* Motivational Quote & Alerts Segment */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quote Card */}
        <div className="md:col-span-2 rounded-2xl border border-blue-50 bg-blue-50/20 p-5 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm italic font-medium text-gray-800">"{randomQuote.text}"</p>
            <p className="mt-1 text-xs font-bold text-gray-500">— {randomQuote.author}</p>
          </div>
        </div>

        {/* Low Streak Recovery Warn Card */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Current Streak: {streak} Days</h4>
              <p className="text-xs text-gray-600">Complete 1 study block today to keep your streak healthy!</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigateToTab('motivation')}
            className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
          >
            Go to Streak Recovery Mode <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Grid of Key Rings / Metric cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Progress Ring Card */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Syllabus Complete</span>
            <span className="text-2xl font-black text-gray-900">{completionPercentage}%</span>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-emerald-600">{completedChapters}</span> Chapter units finished
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="h-18 w-18 rotate-[-90deg]">
              <circle
                cx="36"
                cy="36"
                r="28"
                className="stroke-gray-100 fill-none"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r="28"
                className="stroke-blue-600 fill-none transition-all duration-500"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 - (completionPercentage / 100) * 2 * Math.PI * 28}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-blue-600">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Revision Queue status */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Revisions Pending</span>
              <span className="text-2xl font-black text-gray-900">{revisionsDueToday}</span>
            </div>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">Due for spaced interval recall</p>
            <button 
              onClick={() => onNavigateToTab('revision')}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-0.5"
            >
              Solve Queue <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Today's Tasks Completed % */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Study Blocks Done</span>
              <span className="text-2xl font-black text-gray-900">{completedTasks}/{activeTasks.length}</span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${todayTaskRate}%` }} />
            </div>
            <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
              <span>{todayTaskRate}% Complete</span>
              {missedTasks > 0 && <span className="text-rose-500 font-bold">{missedTasks} missed backlog</span>}
            </div>
          </div>
        </div>

        {/* Latest Mock status */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Latest Mock Result</span>
              <span className="text-2xl font-black text-gray-900">{latestMock ? `${Math.round(latestMock.score)}/200` : 'None'}</span>
            </div>
            <div className={`rounded-xl p-2 ${mockTrendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
              {mockTrendUp ? <TrendingUp className="h-4.5 w-4.5" /> : <TrendingDown className="h-4.5 w-4.5" />}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              {latestMock ? `Accuracy: ${latestMock.accuracy}%` : 'Practice scheduled'}
            </span>
            <button 
              onClick={() => onNavigateToTab('mocks')}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Planner & Targets Side-by-side */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's study schedule block list */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900">Today's Scheduled Study Planner</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('planner')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center"
              >
                Full Planner Grid <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  No blocks allocated for today. Tap "Full Planner Grid" to program your day.
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      task.status === 'COMPLETED' 
                        ? 'bg-emerald-50/30 border-emerald-100 text-gray-500 line-through' 
                        : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        task.priority === 'HIGH' ? 'bg-rose-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className={`text-xs font-semibold ${task.status === 'COMPLETED' ? 'text-gray-400' : 'text-gray-800'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          {task.startTime} — {task.endTime} ({task.recurring ? 'Recurring Routine' : 'One-off Target'})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {task.priority}
                      </span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        task.status === 'COMPLETED' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white'
                      }`}>
                        {task.status === 'COMPLETED' && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <span>Progress: {completedTasks} of {activeTasks.length} study tasks checked finished</span>
            <button 
              onClick={() => onNavigateToTab('subjects')}
              className="text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Browse Syllabus Chapters
            </button>
          </div>
        </div>

        {/* Right side widgets stack */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pomodoro focus timer linked directly to Log Hours and Tasks */}
          <PomodoroWidget 
            tasks={tasks}
            onToggleTask={onToggleTask}
            onQuickLogHours={onQuickLogHours}
            onAddToast={onAddToast}
          />

          {/* Upcoming targets / checklists tracker */}
          <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  <span>Coach Reminders ({activeReminders.length})</span>
                </h3>
                {activeReminders.length > 0 && (
                  <button 
                    onClick={onQuickClearReminders}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Dismiss Done
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {activeReminders.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400">
                    All milestones and reminders cleared! Clear mindset ahead.
                  </div>
                ) : (
                  activeReminders.map((rem) => (
                    <div key={rem.id} className="flex gap-3 items-start p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <span className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        rem.type === 'REVISION' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        rem.type === 'MOCK' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        rem.type === 'BACKLOG' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {rem.type}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700">{rem.title}</p>
                        <span className="text-[9px] font-bold text-gray-400">Due {rem.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500">KNOWLEDGE TARGET STATUS</p>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <span className="block text-sm font-bold text-slate-800">{completedChapters}</span>
                    <span className="text-[9px] text-slate-400 uppercase">Completed</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="block text-sm font-bold text-blue-600">{inProgressChapters}</span>
                    <span className="text-[9px] text-slate-400 uppercase">Active Now</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="block text-sm font-bold text-slate-400">{totalChapters - completedChapters - inProgressChapters}</span>
                    <span className="text-[9px] text-slate-400 uppercase">Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
