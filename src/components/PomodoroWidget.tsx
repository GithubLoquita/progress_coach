/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Award, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { DailyTask } from '../types';

interface PomodoroWidgetProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onQuickLogHours: (hours: number) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function PomodoroWidget({
  tasks,
  onToggleTask,
  onQuickLogHours,
  onAddToast
}: PomodoroWidgetProps) {
  const [sessionLength, setSessionLength] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timeLeft when sessionLength changes, but only if not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  // Main countdown tick logic
  useEffect(() => {
    if (isRunning) {
      const intervalSpeed = isDemoMode ? 60 : 1000; // 60ms in demo mode means 1 second goes 16x faster
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, intervalSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isDemoMode, selectedTaskId]);

  // Sythesize standard browser notification sounds safely without asset failures
  const playCompletionChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Chime note 1 (E5)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.35);

      // Chime note 2 (A5)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.2); // A5
      gain2.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc2.start(audioCtx.currentTime + 0.2);
      osc2.stop(audioCtx.currentTime + 0.65);

    } catch (e) {
      console.warn("AudioContext error: ", e);
    }
  };

  const handleSessionCompletion = () => {
    setIsRunning(false);
    playCompletionChime();
    setCompletedSessions(prev => prev + 1);

    // Identify linked task
    const linkedTask = tasks.find(t => t.id === selectedTaskId);
    const taskName = linkedTask ? linkedTask.title : 'General Study Focus Session';

    // Log the calculated hours (+0.42 hrs for 25 mins)
    const hoursToLog = parseFloat((sessionLength / 60).toFixed(2));
    onQuickLogHours(hoursToLog);

    // Auto mark task as completed if it is linked and pending
    if (linkedTask && linkedTask.status !== 'COMPLETED') {
      onToggleTask(selectedTaskId);
      onAddToast(`Pomodoro Finished! Marked "${taskName}" as completed and logged +${hoursToLog} hours.`, 'success');
    } else {
      onAddToast(`Focus session complete! Logged +${hoursToLog} hours for "${taskName}". Great job!`, 'success');
    }

    // Reset timer
    setTimeLeft(sessionLength * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
  };

  // Human-readable format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Selected task detail
  const currentLinkedTask = tasks.find(t => t.id === selectedTaskId);

  // SVG Circular progress params
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = sessionLength * 60;
  const progressRatio = timeLeft / totalSeconds;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  return (
    <div id="pomodoro-study-timer" className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header Title with animated flame */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600 animate-pulse">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
                <span>Pomodoro Focus Timer</span>
              </h4>
              <p className="text-[10px] text-gray-500 font-medium">Link with active daily tasks list</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              Today: {completedSessions} blocks
            </span>
          </div>
        </div>

        {/* Task dropdown link */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">
            Target Focus Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={isRunning}
            className="w-full text-xs font-semibold text-gray-800 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 outline-hidden focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="">-- General Study Focus Session --</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                [{task.priority}] {task.title} {task.status === 'COMPLETED' ? '✓' : '⟳'}
              </option>
            ))}
          </select>
        </div>

        {/* Main interactive counter layout */}
        <div className="flex items-center justify-center gap-6 py-2">
          {/* Circular Countdown Progress Segment */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="h-36 w-36 rotate-[-90deg]">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-gray-100 fill-none"
                strokeWidth="7"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-red-500 fill-none transition-transform duration-300"
                strokeWidth="7"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${strokeDashoffset}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-mono font-bold tracking-tight text-slate-800">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                {isRunning ? 'FOCUSING' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Quick timing options inside a stack */}
          <div className="flex flex-col gap-1.5 justify-center">
            {[15, 25, 45].map(mins => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  if (!isRunning) {
                    setSessionLength(mins);
                    setTimeLeft(mins * 60);
                  }
                }}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider text-center transition-all ${
                  sessionLength === mins 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic task name notification block */}
        {currentLinkedTask && (
          <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/50 text-[10px] flex items-center gap-1.5 text-blue-800 font-bold justify-between">
            <span className="truncate">🎯 Linked: {currentLinkedTask.title}</span>
            <span className="text-[9px] uppercase bg-blue-100 text-blue-700 px-1 py-0.5 rounded-sm line-clamp-1 truncate shrink-0">
              {currentLinkedTask.status === 'COMPLETED' ? 'Done' : 'Pending'}
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons row & Demonstration speed toggling */}
      <div className="mt-4 space-y-3">
        {/* Play Pause Reset Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
              isRunning 
                ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            title="Reset timer placeholder"
            aria-label="Reset timer"
            className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-950 transition-colors"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        {/* Demo Mode Toggle with helper warn message */}
        <div className="flex justify-between items-center bg-amber-50/30 rounded-xl p-2.5 border border-amber-100">
          <div>
            <span className="text-[10px] font-black text-amber-900 block flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500 font-bold" /> Demo Fast Mode
            </span>
            <span className="text-[9px] text-slate-500">1 Sec is ~15 times faster</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-wider transition-colors ${
              isDemoMode 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {isDemoMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
