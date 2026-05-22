/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  HeartPulse, 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Info, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  Zap,
  Coffee,
  BookOpen
} from 'lucide-react';
import { StudyLog } from '../types';

interface MotivationHabitsProps {
  streak: number;
  studyLogs: StudyLog[];
  onTriggerStreakBump: () => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface MicroAction {
  id: string;
  action: string;
  timeEstimate: string;
  completed: boolean;
  xpValue: number;
}

export default function MotivationHabits({
  streak,
  studyLogs,
  onTriggerStreakBump,
  onAddToast
}: MotivationHabitsProps) {
  const [showRecoveryMode, setShowRecoveryMode] = useState(false);
  const [xpPoints, setXpPoints] = useState(140);

  // Micro goals inside Recovery Mode to build confidence back
  const [microActions, setMicroActions] = useState<MicroAction[]>([
    { id: 'm1', action: 'Read exactly 1 Article of Indian Constitution (No pressure!)', timeEstimate: '3 mins', completed: false, xpValue: 15 },
    { id: 'm2', action: 'Solve exactly 2 simple logical reasoning syllogism queries', timeEstimate: '5 mins', completed: false, xpValue: 20 },
    { id: 'm3', action: 'Write a basic 3-line headline summary of today’s main news', timeEstimate: '4 mins', completed: false, xpValue: 15 },
    { id: 'm4', action: 'Do 3 deep, mindful diaphragmatic breaths to reduce stress', timeEstimate: '1 min', completed: false, xpValue: 10 },
    { id: 'm5', action: 'Clean up your study table and align books neatly', timeEstimate: '5 mins', completed: false, xpValue: 15 }
  ]);

  const handleToggleMicroAction = (id: string) => {
    setMicroActions(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          setXpPoints(p => p + item.xpValue);
          onAddToast(`Micro action completed! +${item.xpValue} XP gained.`, 'success');
        } else {
          setXpPoints(p => p - item.xpValue);
        }
        return { ...item, completed: nextState };
      }
      return item;
    }));
  };

  const handleResetMicroActions = () => {
    setMicroActions(prev => prev.map(i => ({ ...i, completed: false })));
    onAddToast('Recovery micro goals refreshed', 'info');
  };

  // Calculate consistency parameters
  const totalDaysLog = studyLogs.length;
  const averageHoursPerDay = totalDaysLog > 0 
    ? (studyLogs.reduce((acc, l) => acc + l.hours, 0) / totalDaysLog).toFixed(1) 
    : '0';

  // Last 7 days study blocks completed check
  const last7DaysLogs = studyLogs.slice(-7);

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Consistency, Habits & Mental Grit</h2>
          <p className="text-xs text-gray-500">Track streaks, map your monthly heatmap, and deploy Recovery Mode to bounce back from fatigue.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-50 border border-indigo-150 px-4 py-1.5 text-xs font-bold text-indigo-700 flex items-center gap-1">
            <Award className="h-4 w-4 text-indigo-600" />
            <span>Level 4 Aspirant ({xpPoints} XP)</span>
          </div>
          
          <button
            onClick={() => {
              onTriggerStreakBump();
              onAddToast('Great work! Your study streak has been validated.', 'success');
            }}
            className="flex items-center gap-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 transition shadow-soft"
          >
            <Flame className="h-4.5 w-4.5 animate-pulse" />
            <span>Validate Today's Streak</span>
          </button>
        </div>
      </div>

      {/* Main Row: grid of widgets */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Streak Counter details */}
        <div className="rounded-3xl bg-linear-to-b from-amber-50 to-orange-50 border border-amber-100 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Studying Rhythm</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-amber-950 font-mono">{streak}</span>
              <span className="text-sm font-bold text-amber-800">Days Unbroken!</span>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              Every day you log self-study hours keeps the furnace burning. Unbroken streaks trigger optimal brain patterns for WBCS syllabus.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3 border border-amber-100/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-[10px] font-bold text-amber-800">NEXT STREAK REWARD</p>
                <p className="text-xs font-semibold text-gray-800">Day 25 Bronze Medal</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">3 days left</span>
          </div>
        </div>

        {/* Motivation alert / Recovery Mode box */}
        <div className="md:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <HeartPulse className="h-5.5 w-5.5 animate-pulse" />
              <h3 className="font-bold text-gray-900">Feeling fatigued or overwhelmed?</h3>
            </div>
            
            <p className="text-xs text-gray-650 leading-relaxed">
              WBCS is a grueling marathon. If you feel low on grit today, bypass the main schedule and boot up **Coach Motivation Recovery Mode**. It breaks goals into tiny, achievable slices.
            </p>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex gap-3 text-xs">
              <Info className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-slate-650 leading-normal">
                "Small, low-pressure steps break administrative inertia. Once you finish a 3-minute read, chemical momentum will drag you back into learning mode."
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRecoveryMode(true)}
            className="mt-4 w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3.5 flex items-center justify-center gap-1.5 transition shadow-soft"
          >
            <Zap className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            <span>Boot Motivation Recovery Mode</span>
          </button>
        </div>
      </div>

      {/* Heatmap study log representation */}
      <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            <span>Study consistency heatmap log grid (Last 21 Days)</span>
          </h3>
          <span className="text-[10px] uppercase font-bold text-gray-400">Green = target hours logged</span>
        </div>

        {/* Heatmap layout: row of boxes styled with green variants relative to logged hours */}
        <div className="flex flex-wrap gap-2.5 justify-center py-4">
          {studyLogs.map((log, index) => {
            const loggedH = log.hours;
            let bgClass = 'bg-gray-100 border-gray-200';
            let tooltipLabel = 'No hours logged';

            if (loggedH >= 8) {
              bgClass = 'bg-emerald-600 border-emerald-700 text-emerald-50';
              tooltipLabel = 'Superb! 8+ hrs logged';
            } else if (loggedH >= 6) {
              bgClass = 'bg-emerald-400 border-emerald-500 text-emerald-50';
              tooltipLabel = 'Ideal: 6-8 hrs logged';
            } else if (loggedH > 3) {
              bgClass = 'bg-emerald-200 border-emerald-300 text-emerald-900';
              tooltipLabel = 'Standard: 3-6 hrs logged';
            } else if (loggedH > 0) {
              bgClass = 'bg-emerald-50 border-emerald-100 text-emerald-700';
              tooltipLabel = 'Micro-session: under 3 hrs logged';
            }

            return (
              <div 
                key={log.date}
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-xl border text-[10px] font-black transition-all ${bgClass}`}
                title={`${log.date}: ${log.hours} Hours Studies`}
              >
                <span>{log.date.split('-')[2]}</span>
                
                {/* Floating tooltip hover effect */}
                <div className="pointer-events-none absolute bottom-12 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-[9px] font-bold text-white opacity-0 transition group-hover:opacity-100 shadow-md">
                  {log.date} ({loggedH} hrs) — {tooltipLabel}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center items-center gap-6 pt-3 text-[10px] font-bold text-gray-500 border-t border-gray-50 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-gray-100 border border-gray-200 inline-block"></span> Rest Day</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-emerald-50 border border-emerald-150 inline-block"></span> Minor study (&lt;3h)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-emerald-200 border border-emerald-250 inline-block"></span> Regular (3-6h)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-emerald-400 border border-emerald-450 inline-block"></span> Focused (6-8h)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-emerald-600 border border-emerald-650 inline-block"></span> Peak flow (8h+)</span>
        </div>
      </div>

      {/* RECOVERY INTERACTIVE POPUP MODAL */}
      {showRecoveryMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="h-5.5 w-5.5 text-blue-600 animate-bounce" />
                <h3 className="font-bold text-gray-900">Aspirant Recovery Mode active</h3>
              </div>
              
              <button 
                onClick={() => setShowRecoveryMode(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-600 leading-relaxed">
                No goals, no timers, no pressure. Simply complete and check off any simple micro-action below, step by step, to rebuild administrative study inertia. 
              </p>
              <div className="text-[10px] text-indigo-700 font-extrabold">Active Level score: Level 4 ({xpPoints} XP accumulated)</div>
            </div>

            {/* Checklists */}
            <div className="space-y-3 py-2">
              {microActions.map((action) => (
                <div 
                  key={action.id}
                  onClick={() => handleToggleMicroAction(action.id)}
                  className={`flex cursor-pointer select-none items-center justify-between p-3.5 rounded-2xl border transition ${
                    action.completed 
                      ? 'bg-emerald-50/20 border-emerald-150 text-gray-450' 
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      action.completed ? 'bg-emerald-55 bg-emerald-55 bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
                    }`}>
                      {action.completed && <CheckCircle className="h-3 w-3" />}
                    </div>
                    
                    <span className={`text-xs font-semibold ${action.completed ? 'line-through text-slate-400' : 'text-slate-850'}`}>
                      {action.action}
                    </span>
                  </div>

                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    +{action.xpValue} XP
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={handleResetMicroActions}
                className="text-gray-450 hover:text-gray-600 font-bold flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset actions
              </button>

              <button
                type="button"
                onClick={() => setShowRecoveryMode(false)}
                className="rounded-xl bg-blue-600 text-white text-xs font-black px-4 py-2 hover:bg-blue-700 font-sans"
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
