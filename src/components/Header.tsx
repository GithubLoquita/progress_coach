/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Flame, Bell, Sparkles, Command, SlidersHorizontal, BookOpen, Clock, Menu, GraduationCap } from 'lucide-react';
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] px-4 md:px-6 shadow-xs">
      {/* Brand & Decorative Badge */}
      <div className="flex items-center gap-2 md:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="rounded-md p-2 text-gray-500 hover:bg-[#f3f2f1] hover:text-[#201f1e] focus:outline-hidden lg:hidden transition-colors"
            title="Open Application Menu"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {/* Microsoft Fluent-Style 4-Square Grid Accent Logo */}
        <div className="grid grid-cols-2 gap-0.5 h-8 w-8 shrink-0 bg-transparent p-0.5">
          <div className="bg-[#f25f22] rounded-xs"></div>
          <div className="bg-[#7fba00] rounded-xs"></div>
          <div className="bg-[#00a4ef] rounded-xs"></div>
          <div className="bg-[#ffb900] rounded-xs"></div>
        </div>
        
        <div>
          <h1 className="text-sm md:text-base font-black tracking-tight text-[#201f1e] whitespace-nowrap">
            WBCS Coach
          </h1>
          <p className="text-[9px] md:text-[10px] font-bold tracking-wide text-[#0078d4] uppercase whitespace-nowrap">
            Microsoft 365 Study Hub
          </p>
        </div>
      </div>

      {/* Microsoft Fluent Search bar */}
      <div className="relative mx-4 hidden max-w-xl flex-1 md:block">
        <div className="group flex h-9.5 items-center gap-3 rounded-md bg-[#f3f2f1] px-4 py-1.5 transition-all duration-150 hover:bg-[#edebe9] focus-within:bg-white focus-within:hover:bg-white focus-within:shadow-sm border border-[#e0e0e0] focus-within:border-[#0078d4]">
          <Search className="h-4 w-4 text-[#605e5c] group-focus-within:text-[#0078d4]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search syllabus, notes, daily tasks, or current affairs..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchDropdown(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="flex-1 bg-transparent text-xs text-[#201f1e] placeholder-[#605e5c] outline-hidden font-medium"
          />
          <div className="flex items-center gap-1 rounded-xs bg-[#edebe9] px-1.5 py-0.5 text-[8px] font-black text-[#605e5c] uppercase tracking-wider border border-[#e0e0e0]">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Floating results quick dropdown list */}
        {showSearchDropdown && (
          <div className="absolute top-11 left-0 right-0 z-50 rounded-md border border-[#e0e0e0] bg-white p-4 shadow-lg">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#605e5c]">Search Results</p>
            
            {filteredSubjects.length === 0 && filteredNotes.length === 0 && filteredTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#605e5c]">No matching preparation records found.</div>
            ) : (
              <div className="space-y-3">
                {filteredSubjects.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-[#0078d4] uppercase tracking-wide flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Subjects / Syllabus
                    </h4>
                    <div className="mt-1 space-y-1">
                      {filteredSubjects.map(sub => (
                        <button
                          key={sub.id}
                          onMouseDown={() => triggerSearchItemClick('subjects', `Visiting syllabus: ${sub.title}`)}
                          className="w-full text-left rounded-md p-2 text-xs hover:bg-[#f3f2f1] block font-semibold text-[#201f1e]"
                        >
                          {sub.title} ({sub.completedChapters}/{sub.chaptersCount} completed)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredNotes.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-[#107c41] uppercase tracking-wide flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Revision Notes
                    </h4>
                    <div className="mt-1 space-y-1">
                      {filteredNotes.map(note => (
                        <button
                          key={note.id}
                          onMouseDown={() => triggerSearchItemClick('notes', `Viewing study note: ${note.title}`)}
                          className="w-full text-left rounded-md p-2 text-xs hover:bg-[#f3f2f1] block text-[#201f1e]"
                        >
                          <span className="font-bold">{note.title}</span> - {note.content.substring(0, 60)}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredTasks.length > 0 && (
                  <div>
                    <div className="border-t border-[#e0e0e0] my-1 pt-1" />
                    <h4 className="text-[10px] font-black text-[#d83b01] uppercase tracking-wide">Daily Schedule</h4>
                    <div className="mt-1 space-y-1">
                      {filteredTasks.map(task => (
                        <button
                          key={task.id}
                          onMouseDown={() => triggerSearchItemClick('planner', `Selected task: ${task.title}`)}
                          className="w-full text-left rounded-md p-2 text-xs hover:bg-[#f3f2f1] block text-[#201f1e]"
                        >
                          <span className="font-semibold text-[#d83b01]">[{task.startTime} - {task.endTime}]</span> {task.title}
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
        {/* Streak element with flat corporate Microsoft aesthetics */}
        <div 
          onClick={() => onNavigateToTab('motivation')}
          className="flex cursor-pointer items-center gap-1 sm:gap-1.5 rounded-md bg-[#fff4ce] px-2.5 sm:px-3 text-xs font-bold text-[#7928ca] border border-[#f3f2f1] hover:bg-[#fde789] transition-all shrink-0 py-1.5"
          title="Daily Study Streak"
        >
          <Flame className="h-3.5 w-3.5 text-[#ea4335] fill-[#ea4335]" />
          <span>
            <span className="hidden sm:inline">{streak} Day Streak Tracker</span>
            <span className="sm:hidden">{streak}d</span>
          </span>
        </div>

        {/* Notifications trigger */}
        <button 
          onClick={() => onNavigateToTab('reminders')}
          className="relative rounded-md p-2 text-[#605e5c] hover:bg-[#f3f2f1] hover:text-[#201f1e] transition-colors shrink-0"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#0078d4]"></span>
        </button>

        {/* Square profile with smooth rounding, Fluent style */}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0078d4] font-bold text-white shadow-xs text-xs tracking-wider shrink-0 select-none">
          S
        </div>
      </div>
    </header>
  );
}
