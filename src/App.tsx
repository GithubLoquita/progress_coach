/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Subject, 
  Chapter, 
  DailyTask, 
  RevisionItem, 
  MockTest, 
  CurrentAffairsItem, 
  StudyNote, 
  InterviewQuestion, 
  MockFeedback, 
  StudyLog, 
  Reminder, 
  ToastMessage,
  InterviewProfile
} from './types';

import { 
  INITIAL_SUBJECTS, 
  INITIAL_CHAPTERS, 
  INITIAL_TASKS, 
  INITIAL_REVISIONS, 
  INITIAL_MOCKS, 
  INITIAL_CURRENT_AFFAIRS, 
  INITIAL_NOTES, 
  INITIAL_INTERVIEW_QUESTIONS, 
  INITIAL_MOCK_FEEDBACKS, 
  INITIAL_STUDY_LOGS, 
  INITIAL_REMINDERS 
} from './mockData';

// Component Imports
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubjectTracker from './components/SubjectTracker';
import DailyPlanner from './components/DailyPlanner';
import RevisionSystem from './components/RevisionSystem';
import MockTracker from './components/MockTracker';
import CurrentAffairs from './components/CurrentAffairs';
import NotesManager from './components/NotesManager';
import InterviewPrep from './components/InterviewPrep';
import MotivationHabits from './components/MotivationHabits';
import AnalyticsView from './components/AnalyticsView';
import ReminderManager from './components/ReminderManager';
import ToastContainer from './components/ToastContainer';

// Additional visual layouts
import { Plus, Flame, Clock, Sparkles, BookOpen, AlertCircle, Calendar, LayoutDashboard, Award, Menu } from 'lucide-react';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core App states loaded dynamically from localStorage or mocked seed arrays
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const local = localStorage.getItem('wbcs_subjects');
    return local ? JSON.parse(local) : INITIAL_SUBJECTS;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const local = localStorage.getItem('wbcs_chapters');
    return local ? JSON.parse(local) : INITIAL_CHAPTERS;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const local = localStorage.getItem('wbcs_tasks');
    return local ? JSON.parse(local) : INITIAL_TASKS;
  });

  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    const local = localStorage.getItem('wbcs_revisions');
    return local ? JSON.parse(local) : INITIAL_REVISIONS;
  });

  const [mocks, setMocks] = useState<MockTest[]>(() => {
    const local = localStorage.getItem('wbcs_mocks');
    return local ? JSON.parse(local) : INITIAL_MOCKS;
  });

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairsItem[]>(() => {
    const local = localStorage.getItem('wbcs_ca');
    return local ? JSON.parse(local) : INITIAL_CURRENT_AFFAIRS;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const local = localStorage.getItem('wbcs_notes');
    return local ? JSON.parse(local) : INITIAL_NOTES;
  });

  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>(() => {
    const local = localStorage.getItem('wbcs_interview_q');
    return local ? JSON.parse(local) : INITIAL_INTERVIEW_QUESTIONS;
  });

  const [mockFeedback, setMockFeedback] = useState<MockFeedback[]>(() => {
    const local = localStorage.getItem('wbcs_feedback');
    return local ? JSON.parse(local) : INITIAL_MOCK_FEEDBACKS;
  });

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const local = localStorage.getItem('wbcs_logs');
    return local ? JSON.parse(local) : INITIAL_STUDY_LOGS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const local = localStorage.getItem('wbcs_reminders');
    return local ? JSON.parse(local) : INITIAL_REMINDERS;
  });

  const [streak, setStreak] = useState<number>(() => {
    const local = localStorage.getItem('wbcs_streak');
    return local ? Number(local) : 22;
  });

  const [profile, setProfile] = useState<InterviewProfile>(() => {
    const local = localStorage.getItem('wbcs_profile');
    return local ? JSON.parse(local) : {
      name: 'Sandip Hembram',
      district: 'South 24 Parganas',
      academicBackground: 'B.Sc Economics (Hons)',
      optionalSubject: 'Anthropology Paper I & II',
      hobbies: 'Regional history blogging, chess, organic vegetable cultivation'
    };
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // FAB overlay insertion menu
  const [showFabModal, setShowFabModal] = useState(false);
  const [fabNoteTitle, setFabNoteTitle] = useState('');
  const [fabNoteContent, setFabNoteContent] = useState('');

  // Settle back to local storage changes
  useEffect(() => {
    localStorage.setItem('wbcs_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('wbcs_chapters', JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem('wbcs_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wbcs_revisions', JSON.stringify(revisions));
  }, [revisions]);

  useEffect(() => {
    localStorage.setItem('wbcs_mocks', JSON.stringify(mocks));
  }, [mocks]);

  useEffect(() => {
    localStorage.setItem('wbcs_ca', JSON.stringify(currentAffairs));
  }, [currentAffairs]);

  useEffect(() => {
    localStorage.setItem('wbcs_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('wbcs_interview_q', JSON.stringify(interviewQuestions));
  }, [interviewQuestions]);

  useEffect(() => {
    localStorage.setItem('wbcs_feedback', JSON.stringify(mockFeedback));
  }, [mockFeedback]);

  useEffect(() => {
    localStorage.setItem('wbcs_logs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('wbcs_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('wbcs_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('wbcs_profile', JSON.stringify(profile));
  }, [profile]);

  // Global Key Shortcut watcher (CMD + K or '/' focused search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('global-search-input');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast handler
  const handleAddToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Chapter Status / Detail updates
  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(chap => {
      if (chap.id === chapterId) {
        const nextChap = { ...chap, ...updates };
        
        // Recalculate related Subject Completed count
        setTimeout(() => {
          setSubjects(prevSubs => prevSubs.map(sub => {
            if (sub.id === chap.subjectId) {
              const subChaps = chapters.map(c => c.id === chapterId ? nextChap : c).filter(c => c.subjectId === sub.id);
              const completedCount = subChaps.filter(c => c.status === 'COMPLETED').length;
              return {
                ...sub,
                chaptersCount: subChaps.length,
                completedChapters: completedCount
              };
            }
            return sub;
          }));
        }, 10);

        return nextChap;
      }
      return chap;
    }));
  };

  const handleAddChapter = (subjectId: string, title: string, resources?: string) => {
    const newId = `chap-${Date.now()}`;
    const newChap: Chapter = {
      id: newId,
      subjectId,
      title,
      status: 'NOT_STARTED',
      resources
    };

    setChapters(prev => [...prev, newChap]);
    setSubjects(prev => prev.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, chaptersCount: sub.chaptersCount + 1 };
      }
      return sub;
    }));
  };

  const handleAddSubject = (subject: Subject) => {
    setSubjects(prev => [subject, ...prev]);
  };

  // Daily Tasks state managers
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isCompleted = t.status === 'COMPLETED';
        return {
          ...t,
          status: isCompleted ? 'PENDING' : 'COMPLETED'
        };
      }
      return t;
    }));
  };

  const handleAddTask = (item: Omit<DailyTask, 'id'>) => {
    const newId = `task-${Date.now()}`;
    setTasks(prev => [{ id: newId, ...item }, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSetTaskStatus = (id: string, status: DailyTask['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleApplyGeneratedSchedule = (newTasks: Omit<DailyTask, 'id'>[]) => {
    setTasks(prev => {
      // Keep only recurring daily routines to protect static defaults
      const recurring = prev.filter(t => t.recurring);
      const formatted = newTasks.map((t, index) => ({
        id: `ai-${Date.now()}-${index}`,
        ...t
      }));
      return [...formatted, ...recurring];
    });
    handleAddToast('WBCS AI daily study sequence loaded successfully into active boards!', 'success');
  };

  // Spacer repetitions loop marks
  const handleCompleteRevision = (id: string, nextInterval?: 1 | 7 | 21) => {
    setRevisions(prev => prev.map(item => {
      if (item.id === id) {
        if (!nextInterval) {
          // Fully resolved!
          return { ...item, status: 'DONE', lastRevised: new Date().toISOString().split('T')[0] };
        } else {
          // Push ahead next interval
          const calculatedDueDate = new Date();
          calculatedDueDate.setDate(calculatedDueDate.getDate() + nextInterval);
          return {
            ...item,
            intervalDays: nextInterval,
            dueDate: calculatedDueDate.toISOString().split('T')[0],
            lastRevised: new Date().toISOString().split('T')[0]
          };
        }
      }
      return item;
    }));
  };

  const handleAddRevision = (item: Omit<RevisionItem, 'id' | 'status'>) => {
    const newId = `rev-${Date.now()}`;
    setRevisions(prev => [{ id: newId, status: 'PENDING', ...item }, ...prev]);
  };

  // Mocks additions
  const handleAddMock = (mockItem: Omit<MockTest, 'id'>) => {
    const newId = `mock-${Date.now()}`;
    setMocks(prev => [...prev, { id: newId, ...mockItem }]);
  };

  // Current Affairs bullet additions
  const handleAddCurrentAffairs = (caItem: Omit<CurrentAffairsItem, 'id'>) => {
    const newId = `ca-${Date.now()}`;
    setCurrentAffairs(prev => [{ id: newId, ...caItem }, ...prev]);
  };

  // Short Note management folders
  const handleAddNote = (noteItem: Omit<StudyNote, 'id' | 'createdAt'>) => {
    const newId = `note-${Date.now()}`;
    const newNote: StudyNote = {
      id: newId,
      createdAt: new Date().toISOString(),
      ...noteItem
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = (id: string, updates: Partial<StudyNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Interview Guide specs
  const handleUpdateQuestion = (id: string, updates: Partial<InterviewQuestion>) => {
    setInterviewQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleAddQuestion = (qItem: Omit<InterviewQuestion, 'id'>) => {
    const newId = `iq-${Date.now()}`;
    setInterviewQuestions(prev => [...prev, { id: newId, ...qItem }]);
  };

  const handleUpdateProfile = (newProfile: InterviewProfile) => {
    setProfile(newProfile);
  };

  // Log study hours metrics from dashboard
  const handleQuickLogHours = (h: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if todays log already logged
    setStudyLogs(prev => {
      const match = prev.find(l => l.date === todayStr);
      if (match) {
        return prev.map(l => l.date === todayStr ? { ...l, hours: l.hours + h } : l);
      } else {
        return [...prev, { date: todayStr, hours: h, tasksCompleted: 1, activeStreak: streak }];
      }
    });

    setStreak(s => s + 1);
    handleAddToast(`Logged ${h} hours self-study to consistency database. Study streak validated!`, 'success');
  };

  // Backlogs toggler
  const handleQuickClearReminders = () => {
    setReminders(prev => prev.map(r => ({ ...r, isCompleted: true })));
    handleAddToast('All active coach reminders marked processed', 'success');
  };

  // Reminders managers
  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const handleAddReminder = (rem: Omit<Reminder, 'id' | 'isCompleted'>) => {
    const newId = `rem-${Date.now()}`;
    setReminders(prev => [{ id: newId, isCompleted: false, ...rem }, ...prev]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Quick insertion via floating Action button (FAB) modal
  const handleCreateQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabNoteTitle.trim()) return;

    handleAddNote({
      title: fabNoteTitle.trim(),
      subjectId: 'ca', // defaults
      content: fabNoteContent.trim(),
      isPinned: true,
      isBookmarked: false,
      tags: ['Quick FAB', 'Recall']
    });

    setFabNoteTitle('');
    setFabNoteContent('');
    setShowFabModal(false);
    handleAddToast('Quick note stored and pinned to top shelf range', 'success');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafc] font-sans text-gray-900 antialiased">
      {/* Global Header */}
      <Header 
        streak={streak} 
        onGlobalSearch={(term) => {
          // If search matches note/syllabus/tasks, users see live previews in searchbox.
        }}
        subjects={subjects}
        notes={notes}
        tasks={tasks}
        onNavigateToTab={(tabId) => {
          setActiveTab(tabId);
          setMobileMenuOpen(false);
        }}
        onAddToast={handleAddToast}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Collapsible Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={(tabId) => setActiveTab(tabId)} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Core Sub-view container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-5xl transition-all duration-300">
            {activeTab === 'dashboard' && (
              <Dashboard 
                subjects={subjects}
                chapters={chapters}
                tasks={tasks}
                revisions={revisions}
                mocks={mocks}
                reminders={reminders}
                streak={streak}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
                onToggleTask={handleToggleTask}
                onQuickLogHours={handleQuickLogHours}
                onQuickClearReminders={handleQuickClearReminders}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectTracker 
                subjects={subjects}
                chapters={chapters}
                onUpdateChapter={handleUpdateChapter}
                onAddChapter={handleAddChapter}
                onAddSubject={handleAddSubject}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'planner' && (
              <DailyPlanner 
                tasks={tasks}
                subjects={subjects}
                chapters={chapters}
                mocks={mocks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onSetStatus={handleSetTaskStatus}
                onAddToast={handleAddToast}
                onApplyGeneratedSchedule={handleApplyGeneratedSchedule}
              />
            )}

            {activeTab === 'revision' && (
              <RevisionSystem 
                revisions={revisions}
                subjects={subjects}
                onCompleteRevision={handleCompleteRevision}
                onAddRevision={handleAddRevision}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'mocks' && (
              <MockTracker 
                mocks={mocks}
                onAddMock={handleAddMock}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'ca' && (
              <CurrentAffairs 
                currentAffairs={currentAffairs}
                onAddCurrentAffairs={handleAddCurrentAffairs}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'notes' && (
              <NotesManager 
                notes={notes}
                subjects={subjects}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewPrep 
                questions={interviewQuestions}
                feedbacks={mockFeedback}
                profile={profile}
                onUpdateQuestion={handleUpdateQuestion}
                onAddQuestion={handleAddQuestion}
                onUpdateProfile={handleUpdateProfile}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'motivation' && (
              <MotivationHabits 
                streak={streak}
                studyLogs={studyLogs}
                onTriggerStreakBump={() => setStreak(s => s + 1)}
                onAddToast={handleAddToast}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView 
                subjects={subjects}
                chapters={chapters}
                mocks={mocks}
                studyLogs={studyLogs}
                revisions={revisions}
              />
            )}

            {activeTab === 'reminders' && (
              <ReminderManager 
                reminders={reminders}
                onToggleReminder={handleToggleReminder}
                onAddReminder={handleAddReminder}
                onDeleteReminder={handleDeleteReminder}
                onAddToast={handleAddToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) (Material style) */}
      <button 
        onClick={() => setShowFabModal(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition active:scale-95"
        title="Quick micro-note draft capture"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Mobile & Tablet Elegant Bottom Navigation Bar */}
      <nav id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 shadow-lg lg:hidden">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-center transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('subjects');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-center transition-colors ${
            activeTab === 'subjects' ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px]">Syllabus</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('planner');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-center transition-colors ${
            activeTab === 'planner' ? 'text-amber-600 font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px]">Planner</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('mocks');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-center transition-colors ${
            activeTab === 'mocks' ? 'text-rose-600 font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Award className="h-5 w-5" />
          <span className="text-[10px]">Mocks</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-center transition-colors ${
            mobileMenuOpen ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px]">All Menus</span>
        </button>
      </nav>

      {/* FAB Modal popup */}
      {showFabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 flex items-center gap-1.5 text-base">
                <BookOpen className="h-4.5 w-4.5 text-blue-600 animate-pulse" /> Capture Quick Revision Note
              </h3>
              <button 
                onClick={() => setShowFabModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            <p className="text-xs text-gray-600">
              Instantly jot down a tricky constitutional article, historical date, or formula discovered during mock reviews. It stores directly inside your unfiled Keep notes folders.
            </p>

            <form onSubmit={handleCreateQuickNote} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Note header overview</label>
                <input 
                  type="text" 
                  value={fabNoteTitle}
                  onChange={(e) => setFabNoteTitle(e.target.value)}
                  placeholder="e.g. Fundamental Duties source: USSR constitution"
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-blue-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Quick parameters list</label>
                <textarea 
                  rows={4}
                  value={fabNoteContent}
                  onChange={(e) => setFabNoteContent(e.target.value)}
                  placeholder="Insert bullet points or notes..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowFabModal(false)}
                  className="text-xs px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="text-xs px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Containers */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
