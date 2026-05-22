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
    <div className="space-y-6 text-[#201f1e] font-sans">
      {/* Banner / Welcome Segment in Microsoft Corporate Style */}
      <div className="flex flex-col justify-between gap-4 rounded-md bg-[#0078d4] p-5 text-white md:flex-row md:items-center shadow-xs border border-[#005a9e]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-xs bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
              STUDY PROFILE SYNCED
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#107c41]"></span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">WBCS Exam WorkSpace</h2>
          <p className="text-xs text-[#f3f2f1] max-w-lg">
            Welcome to your preparation dashboard. Focus today on History revision and GS descriptive composition. You're outperforming 85% of peers this week!
          </p>
        </div>
        
        {/* Quick Study Hours Logger */}
        <div className="rounded-md bg-white/10 p-3.5 border border-white/20 min-w-[200px]">
          <p className="text-xs font-bold text-white flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Log Daily Study Session
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <input 
              type="number"
              min="1"
              max="16"
              value={logHoursVal}
              onChange={(e) => setLogHoursVal(Number(e.target.value))}
              className="w-16 rounded-xs border border-white/30 bg-white/20 px-2 py-1 text-center text-xs font-bold text-white outline-hidden focus:border-white focus:bg-white/30"
            />
            <button 
              onClick={() => {
                onQuickLogHours(logHoursVal);
                setLogHoursVal(2);
              }}
              className="flex-1 rounded-xs bg-white px-3 py-1.5 text-xs font-bold text-[#0078d4] transition hover:bg-[#faf9f8] hover:text-[#005a9e] active:scale-95"
            >
              Add Hours
            </button>
          </div>
          <p className="mt-1 text-[9px] text-[#deecf9] font-medium">Recommended target: 6-8 hours daily</p>
        </div>
      </div>

      {/* Motivational Quote & Alerts Segment */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Quote Card */}
        <div className="md:col-span-2 rounded-md border border-[#e0e0e0] bg-[#faf9f8] p-4 flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0078d4]/10 text-[#0078d4] border border-[#0078d4]/20">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs italic font-semibold text-[#323130] leading-relaxed">"{randomQuote.text}"</p>
            <p className="mt-0.5 text-[10px] font-bold text-[#605e5c]">— {randomQuote.author}</p>
          </div>
        </div>

        {/* Low Streak Recovery Warn Card */}
        <div className="rounded-md border border-[#edebe9] bg-[#fff4ce] p-4 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#fde789] text-[#7928ca] border border-[#f3f2f1]">
              <Flame className="h-4.5 w-4.5 text-[#ea4335] fill-[#ea4335]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#201f1e]">Study Streak: {streak} Days</h4>
              <p className="text-[10px] text-[#323130] mt-0.5 font-medium">Complete 1 session today to safeguard your score metrics!</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigateToTab('motivation')}
            className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#0078d4] hover:text-[#005a9e] hover:underline"
          >
            Go to Streak Recovery Mode <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Grid of Key Rings / Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Progress Ring Card */}
        <div className="rounded-md bg-white p-4.5 shadow-xs border border-[#e0e0e0] flex items-center justify-between hover:shadow-xs transition-shadow">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-[#605e5c] uppercase tracking-wider block">Syllabus Completion</span>
            <span className="text-2xl font-black text-[#201f1e] leading-none">{completionPercentage}%</span>
            <div className="mt-1 text-[10px] text-[#605e5c] font-medium">
              <span className="font-bold text-[#107c41]">{completedChapters}</span> chapters complete
            </div>
          </div>
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="h-14 w-14 rotate-[-90deg]">
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-[#edebe9] fill-none"
                strokeWidth="5"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-[#107c41] fill-none transition-all duration-500"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 - (completionPercentage / 100) * 2 * Math.PI * 22}`}
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#107c41]">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Revision Queue status */}
        <div className="rounded-md bg-white p-4.5 shadow-xs border border-[#e0e0e0] flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#605e5c] uppercase tracking-wider block">Revisions Due</span>
              <span className="text-2xl font-black text-[#201f1e] leading-none">{revisionsDueToday}</span>
            </div>
            <div className="rounded-md bg-[#efe2f2] p-2 text-[#5c2d91] border border-[#d3b2d6]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1 border-t border-[#f3f2f1]">
            <p className="text-[10px] text-[#605e5c] font-medium">Pending spaced recall</p>
            <button 
              onClick={() => onNavigateToTab('revision')}
              className="text-[10px] font-bold text-[#5c2d91] hover:underline flex items-center gap-0.5"
            >
              Solve Queue <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Today's Tasks Completed % */}
        <div className="rounded-md bg-white p-4.5 shadow-xs border border-[#e0e0e0] flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#605e5c] uppercase tracking-wider block">Micro Tasks Finished</span>
              <span className="text-2xl font-black text-[#201f1e] leading-none">{completedTasks}/{activeTasks.length}</span>
            </div>
            <div className="rounded-md bg-[#dfebe4] p-2 text-[#107c41] border border-[#c4e3d3]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mt-2.5 h-1.5 w-full bg-[#f3f2f1] rounded-none overflow-hidden">
              <div className="h-full bg-[#107c41] transition-all duration-300" style={{ width: `${todayTaskRate}%` }} />
            </div>
            <div className="mt-1.5 text-[9px] text-[#605e5c] flex justify-between font-bold">
              <span>{todayTaskRate}% Completed</span>
              {missedTasks > 0 && <span className="text-[#a4262c]">{missedTasks} missed backlog</span>}
            </div>
          </div>
        </div>

        {/* Latest Mock status */}
        <div className="rounded-md bg-white p-4.5 shadow-xs border border-[#e0e0e0] flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#605e5c] uppercase tracking-wider block">Latest Mock Result</span>
              <span className="text-2xl font-black text-[#201f1e] leading-none">{latestMock ? `${Math.round(latestMock.score)}/200` : 'None'}</span>
            </div>
            <div className={`rounded-md p-2 border ${mockTrendUp ? 'bg-[#dfebe4] text-[#107c41] border-[#c4e3d3]' : 'bg-[#fde7e9] text-[#a4262c] border-[#fbc4c4]'}`}>
              {mockTrendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1 border-t border-[#f3f2f1]">
            <span className="text-[9px] font-bold text-[#605e5c] uppercase">
              {latestMock ? `Accuracy: ${latestMock.accuracy}%` : 'Schedules Pending'}
            </span>
            <button 
              onClick={() => onNavigateToTab('mocks')}
              className="text-[10px] font-bold text-[#a4262c] hover:underline"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Planner & Targets Side-by-side */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's study schedule block list */}
        <div className="lg:col-span-2 rounded-md bg-white p-5 border border-[#e0e0e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4.5 pb-2.5 border-b border-[#f3f2f1]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-[#d83b01]" />
                <h3 className="font-bold text-xs uppercase tracking-wide text-[#201f1e]">Today's Task Scheduler</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('planner')}
                className="text-xs font-bold text-[#0078d4] hover:underline flex items-center"
              >
                Go to Planner <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {activeTasks.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#605e5c] font-medium bg-[#faf9f8] rounded-xs border border-[#edebe9]">
                  No study scheduling allocated for today. Tap "Go to Planner" to schedule your desk blocks.
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xs border transition-all cursor-pointer ${
                      task.status === 'COMPLETED' 
                        ? 'bg-[#f3f2f1] border-[#edebe9] text-[#605e5c] line-through' 
                        : 'bg-white border-[#e0e0e0] hover:bg-[#faf9f8] hover:border-[#605e5c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-none ${
                        task.priority === 'HIGH' ? 'bg-[#a4262c]' : task.priority === 'MEDIUM' ? 'bg-[#d83b01]' : 'bg-[#0078d4]'
                      }`} />
                      <div>
                        <p className={`text-xs font-bold ${task.status === 'COMPLETED' ? 'text-[#605e5c]' : 'text-[#201f1e]'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] font-semibold text-[#605e5c] mt-0.5">
                          {task.startTime} — {task.endTime} ({task.recurring ? 'Recurring Blueprint' : 'Standard Routine'})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`rounded-xs px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        task.priority === 'HIGH' ? 'bg-[#fde7e9] text-[#a4262c] border border-[#fbc4c4]' : task.priority === 'MEDIUM' ? 'bg-[#fff4ce] text-[#d83b01] border border-[#fde789]' : 'bg-[#dfefe4] text-[#107c41]'
                      }`}>
                        {task.priority}
                      </span>
                      <div className={`flex h-4 w-4 items-center justify-center rounded-xs border ${
                        task.status === 'COMPLETED' ? 'border-[#107c41] bg-[#107c41] text-white' : 'border-[#a19f9d] bg-white'
                      }`}>
                        {task.status === 'COMPLETED' && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#f3f2f1] text-[11px] text-[#605e5c] flex items-center justify-between font-medium">
            <span>Completed: <span className="font-bold text-[#107c41]">{completedTasks}</span> of {activeTasks.length} logged tasks checked</span>
            <button 
              onClick={() => onNavigateToTab('subjects')}
              className="text-[11px] font-bold text-[#0078d4] hover:underline"
            >
              Browse Syllabus Blueprint
            </button>
          </div>
        </div>

        {/* Right side widgets stack */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pomodoro focus timer linked directly to Log Hours and Tasks */}
          <PomodoroWidget 
            tasks={tasks}
            onToggleTask={onToggleTask}
            onQuickLogHours={onQuickLogHours}
            onAddToast={onAddToast}
          />

          {/* Upcoming targets / checklists tracker */}
          <div className="rounded-md bg-white p-5 border border-[#e0e0e0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#f3f2f1]">
                <h3 className="font-bold text-xs uppercase tracking-wide text-[#201f1e] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#0078d4]" />
                  <span>Due Reminders ({activeReminders.length})</span>
                </h3>
                {activeReminders.length > 0 && (
                  <button 
                    onClick={onQuickClearReminders}
                    className="text-[10px] font-black text-[#0078d4] uppercase hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {activeReminders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#605e5c] font-medium bg-[#faf9f8] rounded-xs border border-[#edebe9]">
                    All milestones and reminders cleared! Clear workspace path.
                  </div>
                ) : (
                  activeReminders.map((rem) => (
                    <div key={rem.id} className="flex gap-2.5 items-start p-2.5 bg-[#faf9f8] rounded-xs border border-[#edebe9]">
                      <span className={`mt-0.5 rounded-xs px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        rem.type === 'REVISION' ? 'bg-[#efe2f2] text-[#5c2d91] border border-[#d3b2d6]' :
                        rem.type === 'MOCK' ? 'bg-[#fde7e9] text-[#a4262c] border border-[#fbc4c4]' :
                        rem.type === 'BACKLOG' ? 'bg-[#fff4ce] text-[#c45b00] border border-[#fde789]' :
                        'bg-[#deecf9] text-[#004e8c] border border-[#71afe5]'
                      }`}>
                        {rem.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#201f1e] truncate">{rem.title}</p>
                        <span className="text-[9px] font-semibold text-[#605e5c]">Due {rem.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#f3f2f1]">
              <div className="rounded-xs bg-[#f3f2f1] p-3 text-center border border-[#edebe9]">
                <p className="text-[9px] font-black text-[#605e5c] uppercase tracking-wider">KNOWLEDGE MATRIX STATUS</p>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <div className="text-center">
                    <span className="block text-sm font-bold text-[#107c41] leading-none">{completedChapters}</span>
                    <span className="text-[8px] text-[#605e5c] font-bold uppercase tracking-wider mt-0.5 block">Done</span>
                  </div>
                  <div className="h-5 w-px bg-[#edebe9]" />
                  <div className="text-center">
                    <span className="block text-sm font-bold text-[#0078d4] leading-none">{inProgressChapters}</span>
                    <span className="text-[8px] text-[#605e5c] font-bold uppercase tracking-wider mt-0.5 block">Active</span>
                  </div>
                  <div className="h-5 w-px bg-[#edebe9]" />
                  <div className="text-center">
                    <span className="block text-sm font-bold text-[#605e5c] leading-none">{totalChapters - completedChapters - inProgressChapters}</span>
                    <span className="text-[8px] text-[#605e5c] font-bold uppercase tracking-wider mt-0.5 block">Next</span>
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
