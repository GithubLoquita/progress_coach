/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  FolderOpen, 
  Pin, 
  Bookmark, 
  Plus, 
  Search, 
  Trash2, 
  Heart,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { StudyNote, Subject } from '../types';

interface NotesManagerProps {
  notes: StudyNote[];
  subjects: Subject[];
  onAddNote: (note: Omit<StudyNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (noteId: string, updates: Partial<StudyNote>) => void;
  onDeleteNote: (noteId: string) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function NotesManager({
  notes,
  subjects,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddToast
}: NotesManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFolderSubjectId, setActiveFolderSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onAddToast('Please compile note headers and details', 'warning');
      return;
    }

    const tags = tagsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    onAddNote({
      title: title.trim(),
      subjectId: selectedSubjectId,
      content: content.trim(),
      tags,
      isPinned,
      isBookmarked: false
    });

    setTitle('');
    setContent('');
    setTagsStr('');
    setIsPinned(false);
    setShowAddForm(false);
    onAddToast('Short revision note filed & indexed in folder', 'success');
  };

  const handleTogglePin = (id: string, currentPin: boolean) => {
    onUpdateNote(id, { isPinned: !currentPin });
    onAddToast(!currentPin ? 'Note pinned to top shelf' : 'Note unpinned from shelf', 'info');
  };

  const handleToggleBookmark = (id: string, currentBookmark: boolean) => {
    onUpdateNote(id, { isBookmarked: !currentBookmark });
    onAddToast(!currentBookmark ? 'Note marked as critical' : 'Note unmarked', 'info');
  };

  // Group and count notes per subject folder
  const getNotesCountForSubject = (subId: string) => {
    return notes.filter(n => n.subjectId === subId).length;
  };

  const filteredNotes = notes.filter(note => {
    const matchesSubject = activeFolderSubjectId === 'all' || note.subjectId === activeFolderSubjectId;
    const matchesQuery = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesQuery;
  });

  // Sort: output Pinned notes first
  const sortedNotes = [...filteredNotes].sort((a,b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Personal digital Revision Notebooks</h2>
          <p className="text-xs text-gray-500">File micro revision summaries, tag formulas or charts, and pin essentials on your dashboard shelf.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Write Short Note</span>
        </button>
      </div>

      {/* Adding short notes form */}
      {showAddForm && (
        <form onSubmit={handleCreateNote} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" /> Catalog micro study note
            </h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Note header (Topic overview)</label>
              <input
                type="text"
                placeholder="e.g. Laxmikanth Shortcut: Trick inside All Writs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Folder / Core Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Note Content (Markdown, Bullet lists or parameters)</label>
            <textarea
              rows={5}
              placeholder="1. Habeas Corpus: To have the body of (protect against unlawful detention)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none font-sans"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Note Tag labels (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Writs, Article-32, Laxmikanth"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6 pl-2">
              <input
                type="checkbox"
                id="pinOnDashboard"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="pinOnDashboard" className="text-xs font-semibold text-slate-700 cursor-pointer">
                📌 Pin to notes quick shelf
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-black px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Secure Note
            </button>
          </div>
        </form>
      )}

      {/* Two Columns: folders vs Notes grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Subject Folders cabinet */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Subject Folders</p>
          
          <button
            onClick={() => setActiveFolderSubjectId('all')}
            className={`flex w-full items-center justify-between rounded-2xl p-3 text-xs font-bold border transition ${
              activeFolderSubjectId === 'all' 
                ? 'bg-blue-50/50 border-blue-200 text-blue-900 shadow-xs' 
                : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" /> All Folders
            </span>
            <span className="bg-gray-100 text-gray-650 px-2 py-0.5 rounded-full text-[10px]">{notes.length}</span>
          </button>

          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {subjects.map((sub) => {
              const count = getNotesCountForSubject(sub.id);
              const isFolderActive = activeFolderSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveFolderSubjectId(sub.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-2.5 text-xs font-semibold border transition ${
                    isFolderActive 
                      ? 'bg-blue-50/30 border-blue-150 text-blue-800' 
                      : 'bg-white border-transparent hover:border-gray-100 text-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate pr-2">
                    <BookOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{sub.title}</span>
                  </span>
                  <span className="bg-slate-50 text-slate-505 px-1.5 py-0.5 rounded text-[10px] shrink-0 font-extrabold">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes Grid layout */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-3xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 ml-1">
              <span>Selected Shelf Items</span>
              <span className="text-xs text-gray-400 font-medium font-mono">({sortedNotes.length})</span>
            </h3>

            <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 border border-transparent focus-within:border-gray-250">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-gray-850 outline-none w-48"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sortedNotes.length === 0 ? (
              <div className="sm:col-span-2 text-center py-20 text-xs text-gray-400 bg-white rounded-3xl border border-gray-100">
                Folder is empty. Log a dynamic revision note above.
              </div>
            ) : (
              sortedNotes.map((note) => {
                const sub = subjects.find(s => s.id === note.subjectId);
                return (
                  <div 
                    key={note.id} 
                    className={`rounded-2xl border bg-white p-5 flex flex-col justify-between hover:shadow-sm hover:border-blue-200 transition relative ${
                      note.isPinned ? 'border-amber-250 bg-amber-50/5' : 'border-gray-100'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] font-bold text-gray-400 max-w-[120px] truncate">
                          📁 {sub ? sub.title : 'Unfiled'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Note Pin triggers */}
                          <button
                            onClick={() => handleTogglePin(note.id, note.isPinned)}
                            className={`p-1 rounded hover:bg-gray-150 transition ${
                              note.isPinned ? 'text-amber-500' : 'text-gray-300'
                            }`}
                            title="Pin note to top shelf"
                          >
                            <Pin className="h-3.5 w-3.5 fill-current" />
                          </button>

                          {/* Critical bookmark trigger */}
                          <button
                            onClick={() => handleToggleBookmark(note.id, note.isBookmarked)}
                            className={`p-1 rounded hover:bg-gray-150 transition ${
                              note.isBookmarked ? 'text-red-500' : 'text-gray-300'
                            }`}
                            title="Bookmark note as high critical value"
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                          </button>

                          {/* Trash button */}
                          <button
                            onClick={() => {
                              onDeleteNote(note.id);
                              onAddToast('Note deleted', 'info');
                            }}
                            className="p-1 rounded hover:bg-rose-50 text-gray-300 hover:text-rose-500 transition"
                            title="Delete note permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-gray-900 leading-snug">{note.title}</h4>
                        <p className="whitespace-pre-line text-xs text-slate-600 leading-relaxed font-sans">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-gray-50">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="bg-indigo-50/50 text-indigo-700 font-extrabold px-2 py-0.5 rounded text-[9px] border border-indigo-100/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
