/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Flame, Bell, Sparkles, Command, SlidersHorizontal, BookOpen, Clock, Menu } from 'lucide-react';
import { Subject, DailyTask, StudyNote } from '../types';

interface HeaderProps {
  streak: number;
  onGlobalSearch: (term: string) => void;
  subjects: Subject[];
  notes: StudyNote[];
  tasks: DailyTask[];
  onNavigateToTab: (tabId: string) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onToggleMobileMenu?: () => void;
}

export default function Header({ 
  streak, 
  onGlobalSearch, 
  subjects, 
  notes, 
  tasks,
  onNavigateToTab,
  onAddToast,
  onToggleMobileMenu
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onGlobalSearch(value);
    setShowSearchDropdown(value.trim().length > 0);
  };

  // Quick results for the search card dropdown
  const filteredSubjects = subjects.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 2);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 2);

  const triggerSearchItemClick = (tabId: string, message: string) => {
    onNavigateToTab(tabId);
    setSearchTerm('');
    setShowSearchDropdown(false);
    onAddToast(message, 'info');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6">
      {/* Brand & Decorative Badge */}
      <div className="flex items-center gap-2 md:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden lg:hidden"
            title="Open Application Menu"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-soft shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm md:text-lg font-semibold tracking-tight text-gray-900 whitespace-nowrap">
            WBCS Coach
          </h1>
          <p className="text-[9px] md:text-[10px] font-medium tracking-wider text-blue-600 uppercase whitespace-nowrap">
            Progress System
          </p>
        </div>
      </div>

      {/* Google-Style Command / Search Bar */}
      <div className="relative mx-4 hidden max-w-xl flex-1 md:block">
        <div className="group flex h-11 items-center gap-3 rounded-full bg-gray-50 px-4 py-2 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent focus-within:border-blue-300">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search syllabus, notes, daily tasks, or CA compile..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchDropdown(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <div className="flex items-center gap-1 rounded bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Floating results quick dropdown list */}
        {showSearchDropdown && (
          <div className="absolute top-13 left-0 right-0 z-50 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Search Results</p>
            
            {filteredSubjects.length === 0 && filteredNotes.length === 0 && filteredTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500">No matching preparation records found.</div>
            ) : (
              <div className="space-y-3">
                {filteredSubjects.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Subjects / Syllabus
                    </h4>
                    <div className="mt-1 space-y-1">
                      {filteredSubjects.map(sub => (
                        <button
                          key={sub.id}
                          onMouseDown={() => triggerSearchItemClick('subjects', `Visiting syllabus: ${sub.title}`)}
                          className="w-full text-left rounded-lg p-2 text-xs hover:bg-blue-50/50 block font-medium text-gray-800"
                        >
                          {sub.title} ({sub.completedChapters}/{sub.chaptersCount} completed)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredNotes.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Revision Notes
                    </h4>
                    <div className="mt-1 space-y-1">
                      {filteredNotes.map(note => (
                        <button
                          key={note.id}
                          onMouseDown={() => triggerSearchItemClick('notes', `Viewing study note: ${note.title}`)}
                          className="w-full text-left rounded-lg p-2 text-xs hover:bg-emerald-50/50 block text-gray-800"
                        >
                          <span className="font-semibold">{note.title}</span> - {note.content.substring(0, 60)}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredTasks.length > 0 && (
                  <div>
                    <div className="border-t border-gray-50 my-1 pt-1" />
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Daily Schedule</h4>
                    <div className="mt-1 space-y-1">
                      {filteredTasks.map(task => (
                        <button
                          key={task.id}
                          onMouseDown={() => triggerSearchItemClick('planner', `Selected task: ${task.title}`)}
                          className="w-full text-left rounded-lg p-2 text-xs hover:bg-amber-50/50 block text-gray-800"
                        >
                          <span className="font-medium text-amber-900">[{task.startTime} - {task.endTime}]</span> {task.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions Block */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak chip with real-time visual heat indicator - Google style */}
        <div 
          onClick={() => onNavigateToTab('motivation')}
          className="flex cursor-pointer items-center gap-1 sm:gap-1.5 rounded-full bg-amber-50 px-2 sm:px-3.5 py-1.5 text-xs font-semibold text-amber-800 transition-all hover:bg-amber-100 shrink-0"
          title="Daily Study Streak"
        >
          <Flame className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-600 fill-amber-500 animate-pulse" />
          <span>
            <span className="hidden sm:inline">{streak} Day Streak</span>
            <span className="sm:hidden">{streak}d</span>
          </span>
        </div>

        {/* Notifications and Calendar Shortcut triggers */}
        <button 
          onClick={() => onNavigateToTab('reminders')}
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600"></span>
        </button>

        {/* Rounded Profile Photo avatar - Google style */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-soft shrink-0">
          S
        </div>
      </div>
    </header>
  );
}
