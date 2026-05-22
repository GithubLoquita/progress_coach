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
    <div id="pomodoro-study-timer" className="rounded-md border border-[#e0e0e0] bg-white p-4.5 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-3.5">
        {/* Header Title in Windows 11 Focus style */}
        <div className="flex items-center justify-between border-b border-[#f3f2f1] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#fde7e9] text-[#a4262c] border border-[#fbc4c4]">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#201f1e] uppercase tracking-wide flex items-center gap-1">
                <span>Focus Session Timer</span>
              </h4>
              <p className="text-[10px] text-[#605e5c] font-medium font-sans">Power up your syllabus preparation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-[#deecf9] text-[#004e8c] px-2 py-0.5 rounded-xs font-bold border border-[#71afe5]">
              Today: {completedSessions}
            </span>
          </div>
        </div>

        {/* Task dropdown link block */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-[#605e5c] uppercase tracking-wider block">
            Link with Active Work Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={isRunning}
            className="w-full text-xs font-bold text-[#201f1e] rounded-xs border border-[#e0e0e0] bg-[#faf9f8] px-2.5 py-1.5 outline-hidden focus:border-[#0078d4] transition-all cursor-pointer"
          >
            <option value="">-- General Syllabus Study --</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                [{task.priority}] {task.title} {task.status === 'COMPLETED' ? '✓' : '⟳'}
              </option>
            ))}
          </select>
        </div>

        {/* Main interactive counter layout */}
        <div className="flex items-center justify-center gap-5 py-1">
          {/* Circular Countdown Progress Segment in Microsoft Red-Orange style */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="h-28 w-28 rotate-[-90deg]">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-[#edebe9] fill-none"
                strokeWidth="6"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-[#d83b01] fill-none transition-transform duration-300"
                strokeWidth="6"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${strokeDashoffset}`}
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-mono font-black tracking-tight text-[#201f1e]">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[8px] text-[#605e5c] uppercase font-black tracking-widest mt-0.5">
                {isRunning ? 'FOCUS ACTIVE' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Quick timing options inside a stack */}
          <div className="flex flex-col gap-1 inline-flex shrink-0">
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
                className={`px-3 py-1 rounded-xs text-[9px] font-bold tracking-wider text-center transition-all border ${
                  sessionLength === mins 
                    ? 'bg-[#fde7e9] text-[#d83b01] border-[#fbc4c4]' 
                    : 'bg-[#faf9f8] text-[#323130] hover:bg-[#edebe9] border-[#e0e0e0]'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic task name notification block */}
        {currentLinkedTask && (
          <div className="p-2 rounded-xs bg-[#f3f2f1] border border-[#edebe9] text-[10px] flex items-center gap-1.5 text-[#201f1e] font-bold justify-between">
            <span className="truncate">🎯 Work Goal: {currentLinkedTask.title}</span>
            <span className="text-[8px] font-black uppercase bg-[#dfebe4] text-[#107c41] px-1 border border-[#c4e3d3] rounded-xs shrink-0">
              {currentLinkedTask.status === 'COMPLETED' ? 'Done' : 'Pending'}
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons row & Demonstration speed toggling */}
      <div className="mt-4 space-y-2">
        {/* Play Pause Reset Row */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-xs font-bold text-xs transition-all active:scale-95 border ${
              isRunning 
                ? 'bg-[#323130] text-white border-[#201f1e] hover:bg-[#201f1e]' 
                : 'bg-[#0078d4] text-white border-[#005a9e] hover:bg-[#106ebe]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-white" />
                <span>Pause</span>
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
            className="p-2 rounded-xs border border-[#e0e0e0] bg-[#faf9f8] hover:bg-[#edebe9] text-[#323130] transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Demo Mode Toggle with helper warn message */}
        <div className="flex justify-between items-center bg-[#fff4ce] rounded-xs p-2 border border-[#fde789]">
          <div>
            <span className="text-[9px] font-bold text-[#6a15a3] block flex items-center gap-1 uppercase tracking-wide">
              <Zap className="h-3 w-3 text-[#ea4335] fill-[#ea4335]" /> Demo Mode SPEED
            </span>
            <span className="text-[8px] text-[#605e5c] font-medium block">1 Sec goes ~15x faster</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-2 py-0.5 rounded-xs text-[8px] font-black uppercase tracking-wider transition-colors border ${
              isDemoMode 
                ? 'bg-[#7928ca] text-white border-[#7928ca]' 
                : 'bg-[#faf9f8] hover:bg-[#edebe9] text-[#605e5c] border-[#e0e0e0]'
            }`}
          >
            {isDemoMode ? 'LIVE SPEED' : 'DEFAULT'}
          </button>
        </div>
      </div>
    </div>
  );
}
