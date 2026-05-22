/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  FolderOpen, 
  Save, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Subject, Chapter } from '../types';

interface SubjectTrackerProps {
  subjects: Subject[];
  chapters: Chapter[];
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  onAddChapter: (subjectId: string, title: string, resources?: string) => void;
  onAddSubject: (subject: Subject) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function SubjectTracker({
  subjects,
  chapters,
  onUpdateChapter,
  onAddChapter,
  onAddSubject,
  onAddToast
}: SubjectTrackerProps) {
  const [selectedSubTab, setSelectedSubTab] = useState<'ALL' | 'PRELIMS' | 'MAINS' | 'OPTIONAL'>('ALL');
  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjects[0]?.id || 'hist');
  
  // Custom states for editing chapter details
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterNotes, setChapterNotes] = useState('');
  const [chapterResources, setChapterResources] = useState('');

  // Sourced input fields to create new elements
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterRes, setNewChapterRes] = useState('');
  
  // Custom Optional subject creation
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const [newOptTitle, setNewOptTitle] = useState('');

  // Filters and searches
  const [searchText, setSearchText] = useState('');

  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchText.toLowerCase());
    if (selectedSubTab === 'ALL') return matchesSearch;
    return sub.category === selectedSubTab && matchesSearch;
  });

  const activeSubject = subjects.find(s => s.id === activeSubjectId);
  const activeChapters = chapters.filter(c => c.subjectId === activeSubjectId);

  const startEditing = (chap: Chapter) => {
    setEditingChapterId(chap.id);
    setChapterNotes(chap.notes || '');
    setChapterResources(chap.resources || '');
  };

  const saveChapterDetails = (id: string) => {
    onUpdateChapter(id, {
      notes: chapterNotes,
      resources: chapterResources
    });
    setEditingChapterId(null);
    onAddToast('Chapter notes & references updated successfully', 'success');
  };

  const handleAddNewChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) {
      onAddToast('Please enter a valid chapter name', 'warning');
      return;
    }
    onAddChapter(activeSubjectId, newChapterTitle.trim(), newChapterRes.trim());
    setNewChapterTitle('');
    setNewChapterRes('');
    onAddToast('New chapter syllabus element added', 'success');
  };

  const handleAddCustomOptional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptTitle.trim()) return;
    
    const newId = `opt-${Date.now()}`;
    const newSubject: Subject = {
      id: newId,
      title: newOptTitle.trim(),
      category: 'OPTIONAL',
      iconName: 'Award',
      chaptersCount: 0,
      completedChapters: 0
    };

    onAddSubject(newSubject);
    setActiveSubjectId(newId);
    setNewOptTitle('');
    setShowOptionalModal(false);
    onAddToast(`Custom optional subject "${newSubject.title}" configured`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">WBCS Syllabus progression engine</h2>
          <p className="text-xs text-gray-500">Track and monitor every chapter across Prelims papers & descriptive Mains papers.</p>
        </div>
        
        {/* Trigger to configured custom Optional subject */}
        <button
          onClick={() => setShowOptionalModal(true)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Configure Optional Subject</span>
        </button>
      </div>

      {/* Filter Menu Bar & Search input */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['ALL', 'PRELIMS', 'MAINS', 'OPTIONAL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedSubTab(tab);
                // If current selection is filtered out, select first matching
                const matches = subjects.filter(s => tab === 'ALL' || s.category === tab);
                if (matches.length > 0 && !matches.some(m => m.id === activeSubjectId)) {
                  setActiveSubjectId(matches[0].id);
                }
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedSubTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'ALL' ? 'All Subjects' : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 border border-transparent focus-within:border-gray-200">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search syllabus..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent text-xs text-gray-850 outline-none w-48"
          />
        </div>
      </div>

      {/* Two Columns: Subjects List & Chapter Detail Pane */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Subjects List Scrollable */}
        <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Subjects Matrix</p>
          {filteredSubjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-white rounded-3xl border border-gray-100">
              No matching subjects. Configure a new optional above.
            </div>
          ) : (
            filteredSubjects.map((sub) => {
              const isActive = sub.id === activeSubjectId;
              const chaps = chapters.filter(c => c.subjectId === sub.id);
              const doneCount = chaps.filter(c => c.status === 'COMPLETED').length;
              const pct = chaps.length > 0 ? Math.round((doneCount / chaps.length) * 100) : 0;
              
              return (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubjectId(sub.id)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-2xl p-4 border transition-all ${
                    isActive 
                      ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                      : 'bg-white border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-1 pr-3">
                    <span className={`text-[8px] font-black uppercase tracking-wider rounded-md px-1.5 py-0.5 border ${
                      sub.category === 'PRELIMS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      sub.category === 'MAINS' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {sub.category}
                    </span>
                    <h4 className={`text-xs font-bold leading-snug ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                      {sub.title}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      {doneCount} of {chaps.length} units complete
                    </p>
                  </div>

                  {/* Tiny progress status bar on side */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold text-gray-600">{pct}%</span>
                    <div className="h-5 w-1.5 rounded-full bg-gray-150 overflow-hidden">
                      <div 
                        className={`w-full rounded-full transition-all duration-300 ${
                          pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-blue-500' : 'bg-amber-500'
                        }`} 
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Subject's Chapters checklist */}
        <div className="md:col-span-2 rounded-3xl bg-white p-6 border border-gray-100 shadow-xs space-y-6">
          <div className="flex flex-col justify-between border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <span className="text-[9px] font-bold text-blue-600 tracking-wider uppercase">Active Syllabus tracker</span>
              <h3 className="text-base font-bold text-gray-900">{activeSubject ? activeSubject.title : 'Details'}</h3>
            </div>
            
            <div className="mt-1 flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs text-gray-500">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span>{activeChapters.length} chapter guides total</span>
            </div>
          </div>

          {/* List of chapters accordion content */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {activeChapters.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">
                No syllabus chapters declared yet. Use the tool below to write a dynamic curriculum chapter unit!
              </div>
            ) : (
              activeChapters.map((chap) => {
                const isEditing = editingChapterId === chap.id;
                return (
                  <div 
                    key={chap.id} 
                    className={`rounded-2xl border p-4 transition-all ${
                      chap.status === 'COMPLETED' ? 'bg-emerald-50/10 border-emerald-100/60' :
                      chap.status === 'IN_PROGRESS' ? 'bg-blue-50/10 border-blue-100/60' : 'bg-gray-50/20 border-gray-150'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Interactive Chapter status click triggers */}
                        <button 
                          onClick={() => {
                            const nextStatus = chap.status === 'NOT_STARTED' ? 'IN_PROGRESS' : 
                                               chap.status === 'IN_PROGRESS' ? 'COMPLETED' : 'NOT_STARTED';
                            onUpdateChapter(chap.id, { status: nextStatus, lastStudied: new Date().toISOString().split('T')[0] });
                            onAddToast(`Status updated to "${nextStatus}" for "${chap.title}"`, 'success');
                          }}
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                            chap.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' :
                            chap.status === 'IN_PROGRESS' ? 'bg-blue-100 border-blue-400 text-blue-600' :
                            'border-gray-300 hover:border-gray-500 bg-white'
                          }`}
                        >
                          {chap.status === 'COMPLETED' ? <CheckCircle2 className="h-3 w-3" /> :
                           chap.status === 'IN_PROGRESS' ? <Clock className="h-3 w-3" /> : null}
                        </button>
                        
                        <div>
                          <h4 className={`text-xs font-bold leading-normal ${chap.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-850'}`}>
                            {chap.title}
                          </h4>
                          {chap.lastStudied && (
                            <p className="text-[9px] text-gray-400 mt-0.5">Last Studied: {chap.lastStudied}</p>
                          )}
                        </div>
                      </div>

                      {/* Right-aligned actions chip */}
                      <div className="flex items-center gap-1.5 self-center">
                        <span className={`rounded-xl px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${
                          chap.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          chap.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {chap.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Chapter details, references read summary, expandable view */}
                    <div className="mt-2 text-xs text-gray-600 space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Standard book References & Resources</label>
                            <input 
                              type="text" 
                              value={chapterResources}
                              onChange={(e) => setChapterResources(e.target.value)}
                              placeholder="e.g. Laxmikanth Ch 4, Spectrum Ch 12"
                              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-blue-500 bg-gray-50/50"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Concept Summary & Micro-Notes</label>
                            <textarea 
                              rows={3}
                              value={chapterNotes}
                              onChange={(e) => setChapterNotes(e.target.value)}
                              placeholder="Add major constitutional provisions, exceptions, supreme court findings or timelines studied here..."
                              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-blue-500 bg-gray-50/50 font-sans"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setEditingChapterId(null)}
                              className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-xl"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => saveChapterDetails(chap.id)}
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1"
                            >
                              <Save className="h-3 w-3" /> Save Detail Record
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {chap.resources && (
                            <p className="font-semibold text-gray-800 text-[11px] mb-1">
                              📖 <span className="text-slate-500">Refs:</span> {chap.resources}
                            </p>
                          )}
                          {chap.notes ? (
                            <p className="whitespace-pre-wrap text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-2 rounded-lg">
                              💡 {chap.notes}
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">No notes created yet.</p>
                          )}
                          
                          <button 
                            onClick={() => startEditing(chap)}
                            className="mt-2 text-[10px] font-bold text-blue-600 hover:underline inline-block"
                          >
                            Edit unit notes & resources
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick inline chapter insertion form */}
          <form onSubmit={handleAddNewChapter} className="border-t border-gray-100 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add New Syllabus Chapter Unit</h4>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input 
                type="text" 
                placeholder="Chapter Unit Title (e.g. Fundamental Duties Art 51A)"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="flex-1 text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-blue-500"
              />
              <input 
                type="text" 
                placeholder="Books / Reference targets"
                value={newChapterRes}
                onChange={(e) => setNewChapterRes(e.target.value)}
                className="w-full sm:w-64 text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-blue-500"
              />
              <button 
                type="submit"
                className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-bold shadow-soft hover:bg-blue-700 transition shrink-0"
              >
                Add Unit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Optional Subject Setup Dialog Modal */}
      {showOptionalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
                <Sparkles className="h-4.5 w-4.5 text-blue-600" /> Configure Optional Subject
              </h3>
              <button 
                onClick={() => setShowOptionalModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            <p className="text-xs text-gray-600">
              The WBCS Mains require one Optional Subject (Two papers of 200 marks each) for Group A and B services. Specify your selected subject here.
            </p>

            <form onSubmit={handleAddCustomOptional} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Optional Subject Name</label>
                <input 
                  type="text" 
                  value={newOptTitle}
                  onChange={(e) => setNewOptTitle(e.target.value)}
                  placeholder="e.g. Anthropology Paper I & II"
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowOptionalModal(false)}
                  className="text-xs px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="text-xs px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition"
                >
                  Confirm Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
